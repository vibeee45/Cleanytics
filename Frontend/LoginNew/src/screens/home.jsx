import DashboardApp from '../components/DashboardApp.jsx';

/**
 * Home screen entry point. The dashboard implementation lives in components
 * so this screen can stay focused on routing/page composition.
 */
export default function HomeScreen(props) {
  return <DashboardApp {...props} />;
}
