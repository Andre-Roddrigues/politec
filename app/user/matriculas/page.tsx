// app/em-breve/page.tsx

import ComingSoon from "../../../components/comingsoon/brevemente";

export default function EmBrevePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <ComingSoon
        pageName="Matriculas"
        launchDate="Janeiro"
        showSubscribe={true}
      />
    </div>
  );
}