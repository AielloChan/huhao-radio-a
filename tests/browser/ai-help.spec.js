import {test, expect} from '@playwright/test';
import bank from '../../data/questions.json' with {type:'json'};

const key='radio-a:progress:v1';
async function practice(page) {
  return page.evaluate(key=>JSON.parse(localStorage.getItem(key)).practice,key);
}
async function start(page) {
  await page.goto('/');
  await page.getByRole('button',{name:'开始顺序刷题'}).click();
}
async function jump(page,question) {
  const session=await practice(page);
  await page.getByRole('button',{name:'打开答题卡'}).click();
  await page.getByRole('button',{name:`第 ${session.ids.indexOf(question.id)+1} 题`,exact:true}).click();
}
async function wrong(page,question) {
  const option=question.options.find(option=>!question.answers.includes(option.id));
  await page.locator(`[data-action="select"][data-id="${option.id}"]`).click();
  await page.getByRole('button',{name:'确认答案'}).click();
  return option;
}

test('答错后展示三个 AI 入口，当前错选随题带出，新窗口打开且不丢进度',async({page,context})=>{
  // Intercept provider navigation: this test never sends a real question to an AI service.
  await context.route(/https:\/\/(qwenwork\.cn|chat\.deepseek\.com|chatgpt\.com)\//,route=>route.fulfill({contentType:'text/html',body:'<h1>AI 入口测试</h1>'}));
  await start(page);
  await expect(page.locator('.ai-help')).toHaveCount(0);
  const session=await practice(page);
  const question=bank.questions.find(question=>question.id===session.ids[0]);
  const selected=await wrong(page,question);
  const saved=await practice(page);
  const order=session.order[question.id];
  const choice=id=>`${String.fromCharCode(65+order.indexOf(id))}. ${question.options.find(option=>option.id===id).text}`;
  const links=page.getByRole('group',{name:'AI 解题'}).getByRole('link');
  await expect(links).toHaveCount(3);
  await expect(page.locator('.ai-help-logo img')).toHaveCount(3);
  await expect.poll(()=>page.locator('.ai-help-logo img').evaluateAll(images=>images.every(image=>image.complete && image.naturalWidth>0))).toBe(true);
  for(let index=0;index<3;index++){
    const link=links.nth(index);
    const url=new URL(await link.getAttribute('href'));
    const prompt=url.searchParams.get('q');
    expect(prompt).toContain(question.prompt);
    expect(prompt).toContain(`我的作答（错误）：\n${choice(selected.id)}`);
    expect(prompt).toContain(`题库正确答案：\n${order.filter(id=>question.answers.includes(id)).map(choice).join('\n')}`);
    await expect(link).toHaveAttribute('target','_blank');
    await expect(link).toHaveAttribute('rel','noopener noreferrer');
    const opened=context.waitForEvent('page');
    await link.click();
    const ai=await opened;
    await ai.waitForLoadState();
    expect(new URL(ai.url()).searchParams.get('q')).toBe(prompt);
    await ai.close();
    expect(await practice(page)).toEqual(saved);
  }
  await page.reload();
  expect(new URL(await page.locator('.ai-help-link').first().getAttribute('href')).searchParams.get('q')).toContain(`我的作答（错误）：\n${choice(selected.id)}`);
});

test('多选漏选携带实际选择，附图使用公开链接，手机底部操作仍固定',async({page})=>{
  await page.setViewportSize({width:320,height:667});
  await start(page);
  const multi=bank.questions.find(question=>question.answers.length>1 && !question.issue);
  await jump(page,multi);
  await page.locator(`[data-action="select"][data-id="${multi.answers[0]}"]`).click();
  await page.getByRole('button',{name:'确认答案'}).click();
  const selectedPrompt=new URL(await page.locator('.ai-help-link').first().getAttribute('href')).searchParams.get('q');
  const selectedSection=selectedPrompt.split('我的作答（错误）：\n')[1].split('\n\n')[0];
  expect(selectedSection.split('\n')).toHaveLength(1);
  expect(selectedPrompt.split('题库正确答案：\n')[1].split('\n\n')[0].split('\n')).toHaveLength(multi.answers.length);
  const image=bank.questions.find(question=>question.image && !question.issue);
  await jump(page,image);
  const footer=await page.locator('.quiz-actions').boundingBox();
  await wrong(page,image);
  await page.locator('.ai-help-link').last().scrollIntoViewIfNeeded();
  const href=await page.locator('.ai-help-link').first().getAttribute('href');
  const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(new URL(href).searchParams.get('q')).toContain(new URL(image.image,canonical).href);
  await expect(page.getByText('附图以链接携带，AI 无法读取时需手动上传。')).toBeVisible();
  expect(await page.locator('.quiz-actions').boundingBox()).toEqual(footer);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const bounds=await page.locator('.ai-help-link').evaluateAll(links=>links.map(link=>({width:link.clientWidth,content:link.scrollWidth,height:link.getBoundingClientRect().height})));
  expect(bounds.every(bound=>bound.content<=bound.width && bound.height>=44)).toBe(true);
});

test('答对和未交卷的考试不展示 AI 入口',async({page})=>{
  await start(page);
  const session=await practice(page);
  const question=bank.questions.find(question=>question.id===session.ids[0]);
  for(const id of question.answers) await page.locator(`[data-action="select"][data-id="${id}"]`).click();
  await page.getByRole('button',{name:'确认答案'}).click();
  await expect(page.locator('.answer-feedback.success')).toBeVisible();
  await expect(page.locator('.ai-help')).toHaveCount(0);
  await page.getByRole('button',{name:'返回',exact:true}).click();
  await page.locator('.bottom-nav').getByRole('link',{name:'模拟考试'}).click();
  await page.getByRole('button',{name:'开始模拟考试'}).click();
  await page.locator('.option').first().click();
  await expect(page.locator('.ai-help')).toHaveCount(0);
  await expect(page.locator('.answer-feedback')).toHaveCount(0);
});
