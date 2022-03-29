import type { NextPage } from 'next'
import Link from 'next/link'

const GameNew: NextPage = () => (
  <div className="main">
    <div className="inner_column">
      <div
        id="edit_game_page_43096"
        className="edit_game_page dashboard_game_edit_base_page page_widget form is_game"
      >
        <div className="tabbed_header_widget">
          <div className="header_breadcrumbs">
            <Link href="/dashboard">
              <a className="trail">Dashboard</a>
            </Link>
          </div>
          <div className="stat_header_widget">
            <div className="text_content">
              <h2>Create a new project</h2>
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <div className="payment_warning">
          <strong>{"You don't have payment configured"}</strong> If you set a
          minimum price above 0 no one will be able to download your project.{' '}
          <a target="_blank" href="/user/settings/seller">
            Edit account
          </a>
        </div>

        <div className="padded">
          <form className="game_edit_form" autoComplete="off" method="post">
            <div className="columns">
              <div className="main left_col first"></div>
              <div className="misc right_col"></div>
            </div>
            <div className="buttons">
              <button className="button save_btn">Save &amp; view page</button>
              <div className="loader form_loader"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)

export default GameNew
