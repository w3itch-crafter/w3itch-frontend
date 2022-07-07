import styles from 'styles/game/new.module.scss'

const FormPaymentWarn: React.FC = () => {
  return (
    <div className={styles.payment_warning}>
      <strong>{"You don't have payment configured"}</strong> If you set a minimum price above 0 no one will be able to
      download your project.{' '}
      <a target="_blank" href="/user/settings/seller">
        Edit account
      </a>
    </div>
  )
}

export default FormPaymentWarn
