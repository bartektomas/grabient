import Inferno from 'inferno' // eslint-disable-line no-unused-vars
import styled from 'styled-components'
import { Animate } from 'react-move'

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  z-index: 10;
  border-radius: 15px;
`

const MainGradient = ({
  lines,
  stops,
  duration,
  hovered,
  id,
  angle,
  wasEditing,
  ...props
}) => {
  const { x1, y1, x2, y2 } = lines
  const gradientId = `linearGradient-${id}`
  const group1Id = `group1-${id}`
  const group2Id = `group2-${id}`
  const rectId = `rectId-${id}`
  return (
    <Animate
      data={{
        opacity: hovered ? 0.5 : 0
      }}
      duration={duration}
    >
      {data => {
        return (
          <Svg {...props}>
            <defs>
              <linearGradient x1={x1} y1={y1} x2={x2} y2={y2} id={gradientId}>
                {stops}
              </linearGradient>

              <rect id='a' width='100%' height='100%' rx='15' />
            </defs>

            <g
              id={group1Id}
              stroke='none'
              stroke-width='1'
              fill='none'
              fill-rule='evenodd'
            >
              <g id={group2Id} fill={`url(#${gradientId})`}>
                <rect id={rectId} width='100%' height='100%' rx='15' />
              </g>

              <use
                fill-opacity={wasEditing ? 0 : data.opacity}
                fill='#000'
                xlink:href='#a'
                fill-rule='evenodd'
              />
            </g>
          </Svg>
        )
      }}
    </Animate>
  )
}

export default MainGradient
