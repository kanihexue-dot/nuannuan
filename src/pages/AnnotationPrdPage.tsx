import { annotationInsightBlocks, annotationSections } from "../data/annotationPrd";
import { firstOpenWeatherOptions } from "../data/firstOpenScene";

const previewWeather = firstOpenWeatherOptions[0];
const previewTag = previewWeather.tags[0];
const upperSections = annotationSections.filter((section) => section.id <= 3);
const lowerSections = annotationSections.filter((section) => section.id >= 4);

function StaticIntroPreview() {
  return (
    <div aria-hidden="true" className="app-shell first-open-shell annotation-preview__app-shell">
      <header className="first-open-hero">
        <div className="first-open-hero__copy">
          <p className="hero-kicker">首次进入</p>
          <h1>小情绪房间</h1>
          <p className="hero-subtitle">
            如果一时还说不清，就先选一个最像你现在的内心天气。
          </p>
        </div>
        <p className="first-open-hero__support">
          再点一个最像你现在会说出口的词，我们慢慢从这里开始。
        </p>
      </header>

      <section className="first-open-layout">
        <section className="first-open-stage">
          <img className="first-open-stage__image" src="/emotion-scenes/1.png" alt="" />

          <div className="first-open-stage__overlay">
            <span className="first-open-stage__badge">首开场景</span>
            <p className="first-open-stage__line">你来就好，慢一点也没关系。</p>
            <p className="first-open-stage__hint">
              现在像是 {previewWeather.weatherLabel}：{previewWeather.weatherHint}
            </p>
          </div>
        </section>

        <aside className="first-open-card">
          <section className="first-open-card__section">
            <p className="first-open-card__eyebrow">第 1 步</p>
            <h2>先用内心天气碰一下现在的自己</h2>
            <p className="first-open-card__copy">
              先选 1 个内心天气，再选 1 个最像你此刻的话。不用急着讲明白，先靠近现在的感觉就好。
            </p>
          </section>

          <section className="first-open-card__section">
            <p className="first-open-card__label">内心天气</p>
            <div className="first-open-card__weather-grid">
              {firstOpenWeatherOptions.map((option) => (
                <div
                  key={option.id}
                  className="first-open-card__choice"
                  data-active={option.id === previewWeather.id}
                >
                  {option.weatherLabel}
                </div>
              ))}
            </div>
          </section>

          <section className="first-open-card__section">
            <p className="first-open-card__label">现在最像哪一句</p>
            <div className="first-open-card__tag-grid">
              {previewWeather.tags.map((tag) => (
                <div
                  key={tag}
                  className="first-open-card__choice first-open-card__choice--tag"
                  data-active={tag === previewTag}
                >
                  {tag}
                </div>
              ))}
            </div>
          </section>

          <section className="first-open-card__footer">
            <p className="first-open-card__selection">
              已选择：{previewWeather.weatherLabel} / {previewTag}
            </p>

            <button type="button" className="first-open-card__continue">
              继续
            </button>
          </section>
        </aside>
      </section>
    </div>
  );
}

function AnnotationSectionList({
  sections,
  title,
  copy
}: {
  sections: typeof annotationSections;
  title: string;
  copy: string;
}) {
  return (
    <div className="annotation-prd__panel">
      <section className="annotation-prd__meta-card">
        <p className="annotation-prd__eyebrow">Page Type</p>
        <h2>{title}</h2>
        <p className="annotation-prd__meta-copy">{copy}</p>
      </section>

      {sections.map((section) => (
        <section key={section.id} className="annotation-prd__section-card">
          <div className="annotation-prd__section-head">
            <span className="annotation-prd__section-number">{section.id}</span>
            <h3>{section.title}</h3>
          </div>

          <div className="annotation-prd__group">
            <p className="annotation-prd__group-label">显示内容</p>
            <ul>
              {section.displayContent.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {section.interaction ? (
            <div className="annotation-prd__group">
              <p className="annotation-prd__group-label">交互</p>
              <ul>
                {section.interaction.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {section.function ? (
            <div className="annotation-prd__group">
              <p className="annotation-prd__group-label">功能</p>
              <ul>
                {section.function.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

export function AnnotationPrdPage() {
  return (
    <main className="app-shell annotation-prd-shell">
      <nav aria-label="页面切换" className="annotation-prd__route-strip">
        <a className="annotation-prd__route-link" href="#">
          首开交互页
        </a>
        <a
          aria-current="page"
          className="annotation-prd__route-link annotation-prd__route-link--active"
          href="#/annotation-prd"
        >
          静态标注页
        </a>
      </nav>

      <header className="annotation-prd__hero">
        <div className="annotation-prd__hero-copy">
          <p className="hero-kicker">首开说明</p>
          <h1>首开静态截图标注页</h1>
          <p className="hero-subtitle">
            只聚焦首次打开这一页，把截图说明、功能标注和讲解口径整理在同一页。
          </p>
        </div>
        <div className="annotation-prd__hero-note">
          <p>当前示意态：已选中“大暴雨 / 烦死了”</p>
          <p>目标用途：评审、对齐低保真说明、输出页面级 PRD</p>
        </div>
      </header>

      <section className="annotation-prd__stack">
        <section className="annotation-prd__workspace">
          <section className="annotation-prd__preview-card">
            <div className="annotation-prd__card-header">
              <p className="annotation-prd__eyebrow">Static Capture 01</p>
              <h2>上半图：进入与场景</h2>
              <p className="annotation-prd__card-copy">
                第一张图只解释首屏进入感、场景视觉和场景浮层，重点对应 1、2、3。
              </p>
            </div>

            <div className="annotation-preview__frame">
              <div className="annotation-preview__surface annotation-preview__surface--upper">
                <span className="annotation-marker annotation-marker--1">1</span>
                <span className="annotation-marker annotation-marker--2">2</span>
                <span className="annotation-marker annotation-marker--3">3</span>

                <div className="annotation-preview__viewport">
                  <div className="annotation-preview__scaled-shell annotation-preview__scaled-shell--upper">
                    <div className="annotation-preview__scaled-content annotation-preview__scaled-content--upper">
                      <StaticIntroPreview />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <AnnotationSectionList
            sections={upperSections}
            title="上半图标注说明"
            copy="这一段只负责解释页面主引导、场景大图和场景浮层，不把选择逻辑揉进来。"
          />
        </section>

        <section className="annotation-prd__workspace">
          <section className="annotation-prd__preview-card">
            <div className="annotation-prd__card-header">
              <p className="annotation-prd__eyebrow">Static Capture 02</p>
              <h2>下半图：选择与继续</h2>
              <p className="annotation-prd__card-copy">
                第二张图保持同一张完整截图，只把红点切换成 4、5、6，方便滚到下半段时继续对照同一页面。
              </p>
            </div>

            <div className="annotation-preview__frame">
              <div className="annotation-preview__surface annotation-preview__surface--lower">
                <span className="annotation-marker annotation-marker--4">4</span>
                <span className="annotation-marker annotation-marker--5">5</span>
                <span className="annotation-marker annotation-marker--6">6</span>

                <div className="annotation-preview__viewport">
                  <div className="annotation-preview__scaled-shell annotation-preview__scaled-shell--upper">
                    <div className="annotation-preview__scaled-content annotation-preview__scaled-content--upper">
                      <StaticIntroPreview />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="annotation-prd__panel-stack">
            <AnnotationSectionList
              sections={lowerSections}
              title="下半图标注说明"
              copy="这一段只拆选择逻辑和完成反馈，方便你往下滚时还能对着左边的局部截图讲。"
            />

            <section className="annotation-prd__insight-card">
              <p className="annotation-prd__eyebrow">Usage Notes</p>
              <h2>说明补充</h2>

              {annotationInsightBlocks.map((block) => (
                <section key={block.title} className="annotation-prd__insight-block">
                  <h3>{block.title}</h3>
                  <ul>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}
