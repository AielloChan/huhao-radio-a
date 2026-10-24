import {test} from 'node:test';
import assert from 'node:assert/strict';
import {explanationPrompt, explanationLinks} from '../src/ai-help.js';

const question = {
  id:'TEST-1',prompt:'哪种说法正确？\n包含符号：& + # ? = % / 中文',
  options:[{id:'A',text:'正确选项一'},{id:'B',text:'错误选项'},{id:'C',text:'正确选项二'},{id:'D',text:'其他选项'}],
  answers:['A','C']
};
const session = {classId:'B',order:{'TEST-1':['D','B','A','C']},answers:{'TEST-1':['A','B']}};

test('AI 提问使用当前选项顺序，包含本次错选与漏选所需的完整上下文',()=>{
  const before=structuredClone(session);
  const prompt=explanationPrompt(question,session);
  assert.ok(prompt.includes('B 类 · 题号：TEST-1 · 多选题'));
  assert.ok(prompt.includes('A. 其他选项\nB. 错误选项\nC. 正确选项一\nD. 正确选项二'));
  assert.ok(prompt.includes('我的作答（错误）：\nB. 错误选项\nC. 正确选项一'));
  assert.ok(prompt.includes('题库正确答案：\nC. 正确选项一\nD. 正确选项二'));
  assert.ok(prompt.includes('请区分我选错和漏选的部分'));
  assert.deepEqual(session,before);
});

test('三个平台分别使用约定的参数，中文、换行和特殊字符完整往返',()=>{
  const links=explanationLinks(question,session);
  assert.equal(links.length,3);
  const urls=links.map(link=>new URL(link.href));
  assert.deepEqual(urls.map(url=>url.origin),['https://qwenwork.cn','https://chat.deepseek.com','https://chatgpt.com']);
  for (const url of urls) assert.equal(url.searchParams.get('q'),explanationPrompt(question,session));
  assert.equal(urls[0].pathname,'/app/');
  assert.equal(urls[0].searchParams.get('autoSend'),'1');
  assert.equal(urls[1].searchParams.get('autosend'),'1');
  assert.equal(urls[1].searchParams.get('search'),'1');
  assert.deepEqual([...urls[2].searchParams.keys()],['q']);
});

test('图题携带站点公开图片链接，未作答时不伪造选择',()=>{
  const prompt=explanationPrompt({...question,image:'./question-images/example.png'},
    {...session,answers:{}},'https://example.com/huhao-radio/');
  assert.ok(prompt.includes('https://example.com/huhao-radio/question-images/example.png'));
  assert.ok(prompt.includes('我的作答：未作答'));
  assert.ok(prompt.includes('不要猜测图中内容'));
});

test('未带类别字段的旧 A 类练习也能正确标注题库',()=>{
  const legacy=structuredClone(session);
  delete legacy.classId;
  assert.ok(explanationPrompt(question,legacy).includes('题库：A 类'));
});
