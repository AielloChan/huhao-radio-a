import {test} from 'node:test';
import assert from 'node:assert/strict';
import {REFERENCE_TOPICS, referenceMatches} from '../src/reference-data.js';
import {restoreView} from '../src/view-state.js';

test('速查数据的行政区和字母电码完整、唯一，关键国内频率边界正确',()=>{
  const rows=id=>REFERENCE_TOPICS.find(topic=>topic.id===id).rows;
  const provinces=rows('provinces').map(row=>row.cells);
  assert.equal(provinces.length,34);
  for (const index of [0,1,2]) assert.equal(new Set(provinces.map(row=>row[index])).size,34);
  for (const [name,code] of [['河北省','HE'],['河南省','HA'],['海南省','HI'],['黑龙江省','HL'],['陕西省','SN']]) {
    assert.equal(provinces.find(row=>row[0]===name)[1],code);
  }
  assert.equal(rows('alphabet').length,26);
  assert.equal(rows('morse').filter(row=>row.group==='字母').length,26);
  assert.equal(rows('morse').filter(row=>row.group==='数字').length,10);
  const signals=rows('morse').map(row=>row.cells[1]);
  assert.equal(new Set(signals).size,signals.length);
  assert.ok(signals.every(signal=>/^[.-]+$/.test(signal)));
  const allocations=rows('amateur');
  assert.equal(allocations.find(row=>row.cells[0]==='40 米').cells[1],'7.0–7.2 MHz');
  assert.equal(allocations.find(row=>row.cells[0]==='70 厘米').cells[2],'次要');
  assert.ok(!allocations.some(row=>row.cells[1].includes('472') || row.cells[1].includes('902')));
});

test('统一搜索跨表、不区分英文大小写，多个词同时匹配，空查询回到所选表',()=>{
  assert.equal(referenceMatches('bands','陕西')[0].id,'regions');
  assert.equal(referenceMatches('bands','陕西').length,2);
  const result=referenceMatches('bands','qsL');
  assert.equal(result.length,1);
  assert.ok(result[0].rows.some(row=>row.cells[0]==='QSL'));
  assert.equal(referenceMatches('bands','430 次要')[0].rows[0].cells[1],'430–440 MHz');
  assert.deepEqual(referenceMatches('bands','不存在的条目'),[]);
  assert.equal(referenceMatches('morse','   ')[0].id,'morse');
});

test('兼容旧页面记录，移除的速查类别回到默认表，保留有效学习页面',()=>{
  const view={tab:'reference',screen:'home',classId:'A',wrongSearch:'',scrollY:100};
  const state={classId:'A',history:[]};
  assert.equal(restoreView(view,state,new Map()).referenceTopic,'bands');
  assert.equal(restoreView({...view,referenceTopic:'removed'},state,new Map()).referenceTopic,'bands');
  const restored=restoreView({...view,referenceTopic:'provinces',referenceSearch:'海南'},state,new Map());
  assert.equal(restored.referenceTopic,'provinces');
  assert.equal(restored.referenceSearch,'海南');
  assert.equal(restored.scrollY,100);
});
