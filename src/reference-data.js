import {spectrumRows, amateurRows} from './reference-radio.js';
import {regionRows, provinceRows} from './reference-regions.js';
import {shorthandRows, alphabetRows, morseRows} from './reference-codes.js';

const frequencySource = ['工信部第 62 号令 · 2023 频率划分规定','https://www.miit.gov.cn/gyhxxhb/jgsj/cyzcyfgs/bmgz/wxdl/art/2023/art_1e98823e689f42ca9ed14dcb6feec07a.html'];
const frequencyPdf = ['河北省工信厅 · 规定全文 PDF','https://gxt.hebei.gov.cn/hbgyhxxht/zcfg30/gnzc/2025042121422486105/2023070510475449521.pdf'];
const crac = ['CRAC · 2025 官方题库','https://www.crac.org.cn/?p=1287'];
export const REFERENCE_TOPICS = [
  {id:'bands',label:'频段与波段',title:'无线电频段和波段',
    intro:'按国内频率划分规定的命名整理；频率范围不含下限、含上限，波长为近似值。',
    columns:['频段','频率范围','波段与波长'],rows:spectrumRows,
    notes:['波长 λ（米）≈ 300 ÷ 频率 f（MHz）。例如 145 MHz 对应约 2.07 米。','Mm 是兆米（10⁶ 米）；dmm 是丝米（0.1 毫米）。中文名称以国内规定为准，如 UHF 为特高频、SHF 为超高频。'],
    sources:[frequencySource,frequencyPdf]},
  {id:'amateur',label:'业余频率',title:'业余业务频率',
    intro:'2023 年规定的中国内地业余业务划分，包含常用波段与微波、毫米波。波段名称是习惯称呼。',
    columns:['波段','频率范围','地位'],rows:amateurRows,
    notes:['主要业务不代表独占；次要业务不得干扰主要业务，也不能要求其保护。实际发射还须符合操作等级、台站执照、设备及当地管理要求。','本表不是工作模式或呼叫频率规划，也不能将卫星业余的部分子段推广到全段。472–479 kHz 在中国内地未划为业余业务，另见脚注 5.80B。'],
    sources:[frequencySource,frequencyPdf]},
  {id:'regions',label:'呼号分区',title:'业余电台省份分区',
    intro:'内地地面业余无线电台呼号的数字分区，按 2024 年管理办法附件 2 整理。',
    columns:['分区号','省级行政区'],rows:regionRows,
    notes:['此表覆盖内地 31 个省级行政区；台湾、香港、澳门不套用本表。空间业余无线电台的分区号另规定为 1。'],
    sources:[['工信部第 67 号令 · 业余无线电台管理办法','https://www.miit.gov.cn/gyhxxhb/jgsj/cyzcyfgs/bmgz/wxdl/art/2024/art_9a2dba77d86942cebd1e9cbacd2d4b20.html'],['附件 2 · 呼号编制和核发要求（第 2 页）','https://www.miit.gov.cn/cms_files/filemanager/1226211233/attach/20238/e3a97cec523441028cc51de62886101c.pdf']]},
  {id:'shorthand',label:'CW / Q 简语',title:'CW 与 Q 简语表',
    intro:'常用通联简语的学习释义。Q 简语加问号可构成询问，实际含义随附加呼号、频率与语境补全。',
    columns:['简语','含义 / 用法','问句示例'],rows:shorthandRows,
    notes:['QSL 表示确认收到；QSL 卡片是确认联络的卡片。QTH 是电台位置，邮寄地址可用 ADR / ADDR 询问。','Q 简语按 ITU-R M.1172 并结合 CRAC 题库的业余用法整理；CW 缩语按 CRAC 题库归纳，表内不是完整原文或完整代码集。'],
    sources:[['ITU-R M.1172 · Q 编码（第 4–8 页）','https://www.itu.int/rec/R-REC-M.1172/en'],crac]},
  {id:'alphabet',label:'字母解释法',title:'字母解释法',
    intro:'国际通用的 ICAO 字母解释法，适合在语音通联中逐字拼读呼号。',
    columns:['字母','标准解释词'],rows:alphabetRows,
    notes:['A 的标准写法是 Alfa，J 是 Juliett；不要按日常英语拼写改成 Alpha 或 Juliet。'],
    sources:[['NATO · 国际字母解释法','https://www.nato.int/en/about-us/nato-history/history-by-theme/symbols-of-nato/nato-phonetic-alphabet']]},
  {id:'morse',label:'摩尔斯电码',title:'国际摩尔斯电码',
    intro:'字母、数字与常用标点；点和划使用不同长度的信号表示。',
    columns:['字符','电码 · 点 / 划'],rows:morseRows,
    notes:['以一个点为 1 个时间单位：划为 3；同一字符内间隔为 1；字符间隔为 3；单词间隔为 7。','表内标点按普通字符列示；操作合成符号需连续拍发，不能简单当作两个独立字母。'],
    sources:[['ITU-R M.1677-1 · 附件 1（正文第 2–3 页）','https://www.itu.int/rec/R-REC-M.1677/en']]},
  {id:'provinces',label:'省级代码',title:'省级行政区字母与数字代码',
    intro:'34 个省级行政区：省、自治区、直辖市及特别行政区。字母代码依据 GB/T 2260—2007，不是车牌简称。',
    columns:['省级行政区','字母代码','六位数字代码'],rows:provinceRows,
    notes:['易混项：河北 HE、河南 HA、海南 HI；黑龙江 HL；陕西 SN、山西 SX。','字母码由中国气象局公布的 GB/T 40153—2021 表 2 交叉核对，该表明确引用 GB/T 2260—2007 表 1；数字码由人民银行公布的 JR/T 0042—2009 表 A.1 交叉核对。本表不含地级市、县区代码。'],
    sources:[['国家标准平台 · GB/T 2260—2007','https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=C9C488FD717AFDCD52157F41C3302C6D'],['中国气象局 · GB/T 40153—2021（正文第 6–7 页）','https://www.cma.gov.cn/zfxxgk/gknr/flfgbz/bz/202209/P020220921722111512618.pdf'],['人民银行 · JR/T 0042—2009（正文第 21 页）','https://www.pbc.gov.cn/eportal/fileDir/image_public/UserFiles/zhengxinguanliju/upload/File/%E5%BE%81%E4%BF%A1%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%20%E8%BF%9D%E7%BA%A6%E7%8E%87%E9%87%87%E9%9B%86%E6%A0%BC%E5%BC%8F.pdf']]}
];

export const DEFAULT_REFERENCE_TOPIC = 'bands';
export function validReferenceTopic(id) { return REFERENCE_TOPICS.some(topic=>topic.id===id); }

export function referenceMatches(topicId, query = '') {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const topics = terms.length ? REFERENCE_TOPICS : REFERENCE_TOPICS.filter(topic=>topic.id===topicId);
  return topics.map(topic=>({...topic,rows:topic.rows.filter(row=>{
    const text = [topic.title,row.group,...row.cells,row.note].filter(Boolean).join(' ').toLocaleLowerCase();
    return terms.every(term=>text.includes(term));
  })})).filter(topic=>topic.rows.length);
}
