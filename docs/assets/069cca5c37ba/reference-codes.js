// Concise study meanings, cross-checked with ITU-R M.1172 and CRAC's 2025 bank.
const qCodes = [
  ['QRA','电台名称','你的电台叫什么名称？'],
  ['QRB','台站间距离','我们相距多远？'],
  ['QRG','准确频率','我的准确频率是多少？'],
  ['QRH','频率变化','我的频率变化了吗？'],
  ['QRI','音调质量','我的音调质量如何？'],
  ['QRK','信号可懂度','我的信号可懂度如何？'],
  ['QRL','正在忙，请勿打扰','你正在忙吗？'],
  ['QRM','受到其他信号干扰','我的信号被干扰了吗？'],
  ['QRN','受到静电干扰','你受到静电干扰吗？'],
  ['QRO','增加发射功率','需要增加功率吗？'],
  ['QRP','降低发射功率','需要降低功率吗？'],
  ['QRQ','加快发报速度','需要发快些吗？'],
  ['QRS','放慢发报速度','需要发慢些吗？'],
  ['QRT','停止发送','可以停止发送吗？'],
  ['QRU','没有事情要传达','你还有事情要传达吗？'],
  ['QRV','已经准备就绪','你准备好了吗？'],
  ['QRX','稍后再次呼叫','何时再次呼叫我？'],
  ['QRZ','呼叫你的电台是……','谁在呼叫我？'],
  ['QSA','信号强度（1–5 级）','我的信号强度如何？'],
  ['QSB','信号正在衰落','我的信号在衰落吗？'],
  ['QSD','发报手法有问题','我的发报手法有问题吗？'],
  ['QSK','可在发报间隙听到插入','你能在发报间隙听到我吗？'],
  ['QSL','确认抄收消息','能确认收到吗？'],
  ['QSO','可直接或经转信通联','能与指定电台通联吗？'],
  ['QSP','可为指定电台转信','能帮助转信吗？'],
  ['QSX','在指定频率守听','能在指定频率守听吗？'],
  ['QSY','改变工作频率','改到指定频率好吗？'],
  ['QTH','电台位置','你的位置在哪里？']
];
const cwCodes = [
  ['73','美好的祝愿'],['ADR / ADDR','地址（如 QSL 卡邮寄地址）'],
  ['AGN','再一次、请重复'],['ARDF','业余无线电测向'],['BOX / P O BOX','邮政信箱'],
  ['BURO','QSL 卡片管理局'],['CK','检查'],['CQ','向各台普遍呼叫'],
  ['DX','远距离、远方电台'],['ES','和'],['FB','很好、业务精湛'],['FER','为了、对于'],
  ['FREQ','频率'],['GA','下午好'],['GE','晚上好'],['GL','祝好运'],
  ['GLD','高兴'],['GM','早上好'],['GN','晚安'],['GND','地面、接地'],
  ['HNY','新年快乐'],['HPE','希望'],['HPY / HPI','幸福'],['HST','快速收发报'],
  ['K','发送完毕，邀请任意电台回答'],['KN','发送完毕，只邀请通联中的对方回答'],
  ['MNY TNX / MNI TNX','非常感谢'],['NW','现在'],['OM','老朋友、老伙计（无关年龄）'],
  ['OP','操作员'],['PSE / PLS','请'],['R','确认收到'],
  ['SAE','写好收信人地址的信封'],['SASE','写好地址并贴邮票或附邮资的信封'],
  ['SRI','抱歉'],['TEMP','温度'],['TNX / TKS','谢谢'],['TU','谢谢你'],
  ['UR','你的、你是'],['WL','将要'],['XYL','妻子'],['YL','女士']
];
export const shorthandRows = [
  ...qCodes.map(cells=>({cells,group:'Q 简语'})),
  ...cwCodes.map(([code,meaning])=>({cells:[code,meaning,'—'],group:'CW 常用缩语'}))
];

// ICAO spelling alphabet; Alfa and Juliett are intentional standard spellings.
const words = 'Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(' ');
export const alphabetRows = words.map((word,index)=>({cells:[String.fromCharCode(65+index),word]}));

// ITU-R M.1677-1, annex 1. Keep ordinary characters separate from procedural signals.
const letterSignals = ['.-','-...','-.-.','-..','.','..-.','--.','....','..','.---','-.-','.-..','--','-.','---','.--.','--.-','.-.','...','-','..-','...-','.--','-..-','-.--','--..'];
const digitSignals = ['-----','.----','..---','...--','....-','.....','-....','--...','---..','----.'];
const punctuation = [['.','.-.-.-'],[',','--..--'],['?','..--..'],['/','-..-.'],['=','-...-'],['+','.-.-.'],['-','-....-'],['@','.--.-.'],['(','-.--.'],[')','-.--.-'],[':','---...'],["'",'.----.']];
export const morseRows = [
  ...letterSignals.map((signal,index)=>({cells:[String.fromCharCode(65+index),signal],group:'字母'})),
  ...digitSignals.map((signal,index)=>({cells:[String(index),signal],group:'数字'})),
  ...punctuation.map(cells=>({cells,group:'标点'}))
];
