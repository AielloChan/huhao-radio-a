import {escape as e} from './ui.js';

const providers = [
  {name:'Qwen Work',logo:'qwenwork.svg',url:'https://qwenwork.cn/app/',params:{autoSend:'1'}},
  {name:'DeepSeek',logo:'deepseek-color.svg',url:'https://chat.deepseek.com/',params:{autosend:'1',search:'1'}},
  {name:'ChatGPT',logo:'openai.svg',url:'https://chatgpt.com/',params:{}}
];

export function explanationPrompt(question, session, siteUrl) {
  const order = session.order[question.id];
  const selected = session.answers[question.id] || [];
  const optionText = id => `${String.fromCharCode(65+order.indexOf(id))}. ${question.options.find(option=>option.id===id).text}`;
  const describe = ids => order.filter(id=>ids.includes(id)).map(optionText).join('\n');
  return [
    '请用中文帮我理解这道业余无线电考试题，重点针对我答错的选项分析。',
    `题库：${session.classId ?? 'A'} 类 · 题号：${question.id} · ${question.answers.length>1 ? '多选题（须全部选对）' : '单选题'}`,
    `题目：\n${question.prompt}`,
    `选项（字母与我做题时的显示顺序一致）：\n${order.map(optionText).join('\n')}`,
    selected.length ? `我的作答（错误）：\n${describe(selected)}` : '我的作答：未作答',
    `题库正确答案：\n${describe(question.answers)}`,
    question.image ? `题目附图：${new URL(question.image,siteUrl).href}\n如果无法读取附图，请说明并让我上传图片，不要猜测图中内容。` : '',
    '请先解释正确答案的原理，再对比我的作答，说明容易混淆的考点；多选题请区分我选错和漏选的部分。最后给一个简短的记忆方法。不确定的内容请明确说明。'
  ].filter(Boolean).join('\n\n');
}

export function explanationLinks(question, session, siteUrl) {
  const prompt = explanationPrompt(question,session,siteUrl);
  return providers.map(provider=>{
    const url = new URL(provider.url);
    url.searchParams.set('q',prompt);
    for (const [key,value] of Object.entries(provider.params)) url.searchParams.set(key,value);
    return {name:provider.name,logo:provider.logo,href:url.href};
  });
}

export function aiHelpView(question, session) {
  const siteUrl = document.querySelector('link[rel="canonical"]')?.href || location.href;
  return `<div class="ai-help"><span class="ai-help-title">让 AI 帮你理清思路</span><div class="ai-help-links" role="group" aria-label="AI 解题">${explanationLinks(question,session,siteUrl).map(({name,logo,href})=>`<a class="secondary ai-help-link" href="${e(href)}" target="_blank" rel="noopener noreferrer" title="${e(name)}" aria-label="用 ${e(name)} 分析这道错题（新窗口）"><span class="ai-help-logo"><img src="./ai-logos/${e(logo)}" width="26" height="26" alt=""></span><span class="ai-help-name">${e(name)}</span></a>`).join('')}</div>${question.image ? '<small>附图以链接携带，AI 无法读取时需手动上传。</small>' : ''}</div>`;
}
