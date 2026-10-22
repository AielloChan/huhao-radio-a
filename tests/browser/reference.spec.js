import {test, expect} from '@playwright/test';

test('七类速查表、跨表搜索及来源可用，中文输入不被重绘打断',async({page})=>{
  await page.goto('/');
  await page.locator('.bottom-nav').getByRole('link',{name:'速查表'}).click();
  await expect(page.getByRole('heading',{name:'电台速查手册'})).toBeVisible();
  const categories=['频段与波段','业余频率','呼号分区','CW / Q 简语','字母解释法','摩尔斯电码','省级代码'];
  for (const name of categories) {
    await page.getByRole('button',{name,exact:true}).click();
    await expect(page.locator('.reference-sheet')).toHaveCount(1);
    await expect(page.getByRole('button',{name,exact:true})).toHaveAttribute('aria-pressed','true');
    expect(await page.locator('.reference-table tbody tr').count()).toBeGreaterThan(0);
  }
  const search=page.getByRole('searchbox',{name:'搜索全部速查表'});
  await search.fill('430 次要');
  await expect(page.locator('.reference-table')).toHaveCount(1);
  await expect(page.getByRole('cell',{name:'430–440 MHz',exact:true})).toBeVisible();
  await search.fill('陕西');
  await expect(page.locator('.reference-sheet')).toHaveCount(2);
  await expect(page.getByRole('cell',{name:'SN',exact:true})).toBeVisible();
  await search.fill('<script>');
  await expect(page.getByRole('heading',{name:'没有找到相关条目'})).toBeVisible();
  await page.getByRole('button',{name:'省级代码',exact:true}).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.reference-table tbody tr')).toHaveCount(34);
  await page.locator('.reference-sources summary').click();
  await expect(page.getByRole('link',{name:/国家标准平台/})).toHaveAttribute('href',/C9C488/);
  const composing=await search.evaluate(input=>{
    input.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));
    input.value='河北';
    input.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));
    return input.isConnected;
  });
  expect(composing).toBe(true);
  await search.dispatchEvent('compositionend');
  await expect(search).toHaveValue('河北');
  await expect(page.getByRole('cell',{name:'HE',exact:true})).toBeVisible();
});

test('离线冷启动保留速查搜索和阅读位置，原刷题会话不受影响',async({page,context})=>{
  await page.goto('/');
  await expect(page.locator('.connection')).toHaveText('离线已就绪');
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  await page.getByRole('button',{name:'开始顺序刷题'}).click();
  await page.locator('.option').first().click();
  const practice=await page.evaluate(()=>JSON.parse(localStorage.getItem('radio-a:progress:v1')).practice);
  await page.getByRole('button',{name:'返回',exact:true}).click();
  await page.locator('.reference-entry').click();
  await page.getByRole('button',{name:'CW / Q 简语',exact:true}).click();
  await page.getByRole('searchbox',{name:'搜索全部速查表'}).fill('Q');
  await page.evaluate(()=>window.scrollTo(0,500));
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('huhao-radio:view:v1')).scrollY)).toBe(500);
  await context.setOffline(true);
  await page.close();
  const reopened=await context.newPage();
  await reopened.goto('/');
  await expect(reopened.getByRole('searchbox',{name:'搜索全部速查表'})).toHaveValue('Q');
  await expect.poll(()=>reopened.evaluate(()=>window.scrollY)).toBe(500);
  await reopened.getByRole('button',{name:'摩尔斯电码',exact:true}).click();
  await expect(reopened.locator('.morse-signal')).toHaveCount(48);
  await reopened.locator('.bottom-nav').getByRole('link',{name:'刷题',exact:true}).click();
  await reopened.getByRole('button',{name:'继续上次练习'}).click();
  await expect(reopened.locator('.option.selected')).toHaveCount(1);
  expect(await reopened.evaluate(()=>JSON.parse(localStorage.getItem('radio-a:progress:v1')).practice)).toEqual(practice);
});

test('手机窄屏和桌面表格不横向溢出，五个导航触控区完整',async({page})=>{
  await page.goto('/#reference');
  for (const width of [320,390,768,1280]) {
    await page.setViewportSize({width,height:844});
    for (const name of ['频段与波段','业余频率','CW / Q 简语','省级代码','摩尔斯电码']) {
      await page.getByRole('button',{name,exact:true}).click();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    }
    if (width<=680) {
      const bounds=await page.locator('.bottom-nav a').evaluateAll(links=>links.map(link=>{
        const {left,right,height}=link.getBoundingClientRect();return {left,right,height};
      }));
      expect(bounds).toHaveLength(5);
      for(let i=0;i<bounds.length;i++){
        expect(bounds[i].height).toBeGreaterThanOrEqual(44);
        expect(bounds[i].left).toBeGreaterThanOrEqual(0);
        expect(bounds[i].right).toBeLessThanOrEqual(width);
        if(i)expect(bounds[i].left).toBeGreaterThanOrEqual(bounds[i-1].right);
      }
    }
  }
});
