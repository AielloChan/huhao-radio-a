import {REFERENCE_TOPICS, referenceMatches} from './reference-data.js';
import {escape as e, icon, empty} from './ui.js';

function referenceTable(topic) {
  let group;
  const rows = topic.rows.map(row=>{
    const heading = row.group && row.group !== group ? `<tr class="reference-group"><th colspan="${topic.columns.length}" scope="colgroup">${e(row.group)}</th></tr>` : '';
    group = row.group;
    return `${heading}<tr class="${row.note ? 'has-note' : ''}">${row.cells.map((cell,index)=>{
      const value = topic.id === 'morse' && index === 1 ? `<span class="morse-signal" aria-label="${e([...cell].map(char=>char==='.'?'点':'划').join(' '))}">${e(cell.replaceAll('.','·').replaceAll('-','−'))}</span>` : e(cell);
      return index === 0 ? `<th scope="row">${value}</th>` : `<td>${value}</td>`;
    }).join('')}</tr>${row.note ? `<tr class="reference-row-note"><td colspan="${topic.columns.length}">${e(row.note)}</td></tr>` : ''}`;
  }).join('');
  return `<section class="reference-sheet" aria-labelledby="reference-${topic.id}"><div class="reference-sheet-heading"><h2 id="reference-${topic.id}">${e(topic.title)}</h2><span>${topic.rows.length} 项</span></div><p class="reference-intro">${e(topic.intro)}</p><table class="reference-table reference-table-${topic.id}"><caption class="sr-only">${e(topic.title)}</caption><thead><tr>${topic.columns.map(column=>`<th scope="col">${e(column)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table><div class="reference-notes">${topic.notes.map(note=>`<p>${e(note)}</p>`).join('')}</div><details class="reference-sources"><summary>依据与来源</summary><ul>${topic.sources.map(([title,url])=>`<li><a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(title)} ↗</a></li>`).join('')}</ul><p>资料核对：2026-10-22 · 表格可离线使用，来源链接需联网。</p></details></section>`;
}

export function referenceView(selected, query) {
  const matches = referenceMatches(selected,query);
  const searching = !!query.trim();
  const count = matches.reduce((sum,topic)=>sum+topic.rows.length,0);
  return `<div class="page-heading"><div><div class="eyebrow">随手查，慢慢记</div><h1>电台速查手册</h1><p>频率、呼号与通联语言，随身带着走。</p></div><span class="reference-mark" aria-hidden="true">${icon('list')}</span></div><section class="reference-tools" aria-label="速查工具"><label class="search"><span class="sr-only">搜索全部速查表</span><input id="reference-search" type="search" placeholder="搜索全部：430、QSL、陕西…" value="${e(query)}" autocomplete="off" spellcheck="false"></label><div class="reference-topics" role="group" aria-label="速查表类别">${REFERENCE_TOPICS.map(topic=>`<button class="reference-topic" data-action="reference-topic" data-id="${topic.id}" aria-pressed="${!searching && selected===topic.id}">${e(topic.label)}</button>`).join('')}</div><p class="reference-count" role="status">${searching ? `找到 ${count} 项 · ${matches.length} 张表` : '7 张速查表 · 支持离线查阅'}</p></section><div class="reference-results">${matches.length ? matches.map(referenceTable).join('') : empty('没有找到相关条目','试试频率数字、中文名称或英文简语。')}</div>`;
}
