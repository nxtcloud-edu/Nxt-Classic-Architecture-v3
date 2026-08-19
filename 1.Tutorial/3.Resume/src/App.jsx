import { useEffect, useState } from 'react';
import {
  achievements,
  contacts,
  education,
  experienceData,
  profile,
  projectMix,
  projects,
  skills,
} from './data/resume.js';
import { useCounters } from './hooks/useCounters.js';
import TopNav from './components/TopNav.jsx';
import Hero from './components/Hero.jsx';
import StatsBar from './components/StatsBar.jsx';
import Section from './components/Section.jsx';
import Achievements from './components/Achievements.jsx';
import AccordionList from './components/AccordionList.jsx';
import SkillTags from './components/SkillTags.jsx';
import ExperienceChart from './components/charts/ExperienceChart.jsx';
import ProjectMixChart from './components/charts/ProjectMixChart.jsx';

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export default function App() {
  // 처음에는 OS 설정을 따르고, 이후에는 토글이 이긴다
  const [darkMode, setDarkMode] = useState(prefersDark);
  const { visitCount, likeCount, like, isConfigured, error } = useCounters();

  // tailwind darkMode:'class' 와 index.css의 .dark 토큰이 이 클래스를 본다
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <TopNav
        name={profile.name}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
      />

      <main className="mx-auto max-w-4xl px-5 pb-20">
        <Hero profile={profile} contacts={contacts} />

        <StatsBar
          visitCount={visitCount}
          likeCount={likeCount}
          onLike={like}
          isConfigured={isConfigured}
          error={error}
        />

        <Section id="achievements" eyebrow="Achievements" title="주요 성과">
          <Achievements items={achievements} />
        </Section>

        <Section
          id="growth"
          eyebrow="Growth"
          title="연도별 성장 추이"
          description="자격증과 활동이 해마다 어떻게 늘었는지 보여준다."
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="card p-5 lg:col-span-3">
              <ExperienceChart data={experienceData} darkMode={darkMode} />
            </div>
            <div className="card p-5 lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-muted">프로젝트 경험 구성</h3>
              <ProjectMixChart data={projectMix} darkMode={darkMode} />
            </div>
          </div>
        </Section>

        <Section id="education" eyebrow="Education" title="교육 이수">
          <AccordionList items={education} columns={2} />
        </Section>

        <Section id="projects" eyebrow="Projects" title="프로젝트">
          <AccordionList items={projects} />
        </Section>

        <Section id="skills" eyebrow="Skills" title="기술">
          <SkillTags items={skills} />
        </Section>

        <footer className="border-t border-line pt-8 text-center text-sm text-faint">
          <p>React + Vite + Tailwind CSS로 제작</p>
          <p className="mt-1">AWS 배포: S3 + Lambda + DynamoDB</p>
        </footer>
      </main>
    </div>
  );
}
