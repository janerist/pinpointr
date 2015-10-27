import $ from "jquery"
import ReactDOM from "react-dom"

export let SetFullHeightMixin = {
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize()
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  },

  handleResize() {
    let $domNode = $(ReactDOM.findDOMNode(this))
    let offset = $domNode.offset()
    $domNode.height($(window).height() - offset.top)
  }
};
