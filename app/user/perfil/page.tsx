
import ComingSoon from "../../../components/comingsoon/brevemente";

export default function EmBrevePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <ComingSoon
        pageName="Perfil"
        launchDate="Fevereiro"
        showSubscribe={true}
      />
    </div>
  );
}