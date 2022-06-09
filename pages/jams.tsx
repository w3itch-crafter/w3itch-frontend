import styled from '@emotion/styled'
import Calendar from 'components/Calendar'
import JamNewJams from 'components/Jam/JamNewJams'
import { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Wrapper = styled.div`
  background-color: var(--w3itch-bg2);
`
const HeaderTitle = styled.h2`
  color: var(--w3itch-text2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 26px;
  padding: 20px var(--w3itch-gutter_width) 0 var(--w3itch-gutter_width);
  margin: 20px 0 0 0;
`
const HeaderDescription = styled.p`
  line-height: 1.5;
  font-size: 16px;
  margin: 24px var(--w3itch-gutter_width);
  max-width: 600px;
`

const Jams: NextPage = () => {
  return (
    <Wrapper>
      <HeaderTitle>Jams Calendar</HeaderTitle>
      <HeaderDescription>
        w3itch.io Aggregate Jam Calendar. w3itch.io is a place to host and
        participate in online games. Anyone can create and instantly.
      </HeaderDescription>
      <JamNewJams />
      <Calendar />
    </Wrapper>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Jams
