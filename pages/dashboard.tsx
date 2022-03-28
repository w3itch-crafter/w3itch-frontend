import type {NextPage} from 'next';
import styles from 'styles/dashboard.module.scss';

const Dashboard: NextPage = () => (
	<div>
		<div className={styles.inner_column}>
			<div id="dashboard_page_79202" className="dashboard_page page_widget">
				<div id="user_header_widget_27838" className="user_header_widget tabbed_header_widget">
					<div className="stat_header_widget">
						<div className="text_container">
							<h2>Creator Dashboard</h2>
						</div>
						<div className="stats_container">
							<div className="stat_box">
								<div className="stat_value">0</div>
								<div className="stat_label">Views</div>
							</div>
							<div className="stat_box">
								<div className="stat_value">0</div><div className="stat_label">Downloads</div>
							</div>
							<a href="/my-followers" data-label="followers_stat" className="followers_stat">
								<div className="stat_box">
									<div className="stat_value">0
									</div>
									<div className="stat_label">Followers{' '}
										<svg strokeLinecap="round" stroke="currentColor" className="svgicon icon_arrow_up_right" role="img" version="1.1" viewBox="0 0 24 24" strokeWidth="2" height="12" strokeLinejoin="round" aria-hidden="" fill="none" width="12">
											<line x1="7" y1="17" x2="17" y2="7">
											</line><polyline points="7 7 17 7 17 17">
											</polyline>
										</svg>
									</div>
								</div>
							</a>
						</div>
					</div>
					<div className="header_nav" id="user_header_widget_27838_tabs">
						<div className="header_nav_tabs">
							<a href="/dashboard" className="nav_btn active">Projects</a>
							<a href="/dashboard/purchases" className="nav_btn">Payments</a>
							<a href="/dashboard/analytics" className="nav_btn">Analytics</a>
							<a href="/dashboard/sales" className="nav_btn">Sales &amp; bundles</a>
							<a href="/dashboard/bundles" className="nav_btn">Co-op bundles</a>
							<a href="/dashboard/jams" className="nav_btn">Game jams</a>
							<a href="/dashboard/payouts" className="nav_btn">Payouts</a>
							<a href="/post-a-job" className="nav_btn">Jobs</a>
						</div>
					</div>
				</div>
				<div className="header_notification itchio_tip">
					<strong>itch.io tips </strong>
					<span>Engage with your audience · Post to your development log to share updates </span>
					<a href="https://itch.io/updates/introducing-devlogs" target="_blank" className="forward_link" rel="noreferrer">learn more</a>
				</div>
				<div className="padded">
					<div className="blank_content">
						<h3>Are you a developer? Upload your first game</h3>
						<a href="/game/new" className="button">Create new project</a>
						<div className="sub_links">
							<a href="/my-feed">Nah, take me to the games feed</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default Dashboard;
