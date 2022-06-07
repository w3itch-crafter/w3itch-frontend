import styles from 'styles/game/new.module.scss'

const FormContentGuidelines: React.FC = () => {
  return (
    <p className={styles.content_guidelines}>
      <strong>Make sure everyone can find your page</strong>
      <br />
      Review our{' '}
      <a rel="noopener noreferrer" href="#" target="_blank">
        quality guidelines
      </a>{' '}
      before posting your project
    </p>
  )
}

export default FormContentGuidelines
