import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import styled from 'styled-components'
import { Transition } from 'react-move'
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc'

import { editStop } from './../../store/stops/actions'

import SwatchItem from './SwatchItem'

const SwatchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const getColors = gradient => {
  return Object.keys(gradient).map(stop => gradient[stop].color)
}

const SortableItem = SortableElement(props => <SwatchItem {...props} />)

const SortableList = SortableContainer(
  ({
    items,
    width,
    height,
    transitionDuration,
    sorting,
    onSortItemClick,
    pickingColor
  }) => {
    return (
      <Transition
        data={items}
        getKey={(item, index) => index}
        update={(item, index) => ({
          width
        })}
        enter={(item, index) => ({
          width: 0
        })}
        leave={(item, index) => ({
          width: 0
        })}
        duration={transitionDuration}
      >
        {data => (
          <SwatchContainer>
            {data.map((item, index) => {
              return (
                <SortableItem
                  disabled={pickingColor}
                  onSortItemClick={onSortItemClick}
                  key={item.key}
                  sorting={sorting}
                  index={index}
                  color={items[index]}
                  style={{
                    backgroundColor: items[index],
                    width: item.state.width
                  }}
                />
              )
            })}
          </SwatchContainer>
        )}
      </Transition>
    )
  }
)

class Swatch extends Component {
  state = {
    colors: null
  }

  componentDidMount () {
    this.setState({
      colors: getColors(this.props.gradient)
    })
  }

  componentWillReceiveProps (nextProps) {
    // update state.colors when a gradient stop is added
    if (
      Object.keys(this.props.gradient).length !==
      Object.keys(nextProps.gradient).length
    ) {
      this.setState({
        colors: getColors(nextProps.gradient)
      })
    }
  }

  _onSortEnd = ({ oldIndex, newIndex }) => {
    const colors = arrayMove(this.state.colors, oldIndex, newIndex)
    const { updateColorStop, id } = this.props
    this.setState({
      colors
    })

    updateColorStop(id, colors)
  }

  _handleSortItemClick = () => {
    this.props.editStop(this.props.id)
  }

  render () {
    const { transitionDuration, editing } = this.props
    const { colors, pickingColor } = this.state
    return (
      colors &&
      <SortableList
        axis='x'
        lockAxis='x'
        pickingColor={pickingColor}
        transitionDuration={transitionDuration}
        items={this.state.colors}
        onSortItemClick={this._handleSortItemClick}
        onSortStart={this._onSortStart}
        onSortEnd={this._onSortEnd}
        width={25}
        distance={5}
        lockToContainerEdges
      />
    )
  }
}

export default connect(
  (state, { id }) => ({ editing: state.stops.editing === id }),
  { editStop }
)(Swatch)