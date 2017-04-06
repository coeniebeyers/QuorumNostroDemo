import { connect } from 'react-redux'
import NodeList from '../components/NodeList'

const mapStateToProps = (state) => ({
  nodeList: state.nodeList
})

const NodesToDisplay = connect(
  mapStateToProps
)(NodeList)

export default NodesToDisplay
