import styled from '@emotion/styled'
import { IcoMoonIcon } from 'components/icons'
import { Children, Fragment, useReducer } from 'react'
import { useSwipeable } from 'react-swipeable'

declare type Direction = 'PREV' | 'NEXT'

declare interface CarouselState {
  pos: number
  sliding: boolean
  dir: Direction
}

declare type CarouselAction =
  | { type: Direction; numItems: number }
  | { type: 'stopSliding' }

function getOrder(index: number, pos: number, numItems: number) {
  return index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos
}

function getInitialState(numItems: number): CarouselState {
  return {
    pos: numItems - 1,
    sliding: false,
    dir: 'NEXT',
  }
}

function reducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case 'PREV':
      return {
        ...state,
        dir: 'PREV',
        sliding: true,
        pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1,
      }
    case 'NEXT':
      return {
        ...state,
        dir: 'NEXT',
        sliding: true,
        pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1,
      }
    case 'stopSliding':
      return { ...state, sliding: false }
    default:
      return state
  }
}

declare interface GameCarouselProps {
  children: React.ReactNode
  className?: string
}

export function GameCarousel({ children, className }: GameCarouselProps) {
  const Carousel = styled.div`
    width: 100%;
    position: relative;
  `
  const Wrapper = styled.div`
    overflow: hidden;
  `
  const CarouselContainer = styled.div<Pick<CarouselState, 'dir' | 'sliding'>>`
    display: flex;
    transition: ${(p) => (p.sliding ? 'none' : 'transform 1s ease')};
    transform: ${(p) => {
      if (!p.sliding) return 'translateX(-240px)'
      if (p.dir === 'PREV') return 'translateX(calc(2 * -240px))'
      return 'translateX(0%)'
    }};
  `
  const SlideButton = styled.button`
    color: #222;
    border: none;
    font-size: 24px;
    &:focus {
      outline: 0;
    }
  `
  const SlideButtonLeft = styled(SlideButton)`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    opacity: 0.6;
  `
  const SlideButtonRight = styled(SlideButton)`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0.6;
  `
  const CarouselSlot = styled.div<{ order: number }>`
    order: ${(p) => p.order};
    margin-right: 20px;
    & > div {
      margin: 0;
    }
  `
  const numItems = Children.count(children)
  const [state, dispatch] = useReducer(reducer, getInitialState(numItems))
  const onSlide = (dir: Direction) => {
    dispatch({ type: dir, numItems })
    setTimeout(() => {
      dispatch({ type: 'stopSliding' })
    }, 50)
  }
  const handlers = useSwipeable({
    onSwipedLeft: () => onSlide('NEXT'),
    onSwipedRight: () => onSlide('PREV'),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: true,
  })
  const handleSlideLeft = () => {
    onSlide('PREV')
  }
  const handleSlideRight = () => {
    onSlide('NEXT')
  }

  return (
    <Carousel className={className} {...handlers}>
      <Wrapper>
        <CarouselContainer dir={state.dir} sliding={state.sliding}>
          {Children.map(children, (child, index) => (
            <CarouselSlot order={getOrder(index, state.pos, numItems)}>
              {child}
            </CarouselSlot>
          ))}
        </CarouselContainer>
      </Wrapper>
      {!!numItems && (
        <Fragment>
          <SlideButtonLeft onClick={handleSlideLeft}>
            <IcoMoonIcon name="arrow-left" />
          </SlideButtonLeft>
          <SlideButtonRight onClick={handleSlideRight}>
            <IcoMoonIcon name="arrow-right" />
          </SlideButtonRight>
        </Fragment>
      )}
    </Carousel>
  )
}
