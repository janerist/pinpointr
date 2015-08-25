export let SetFullHeightMixin = {
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  handleResize() {
    let $domNode = $(this.getDOMNode());
    let offset = $domNode.offset();
    $domNode.height($(window).height() - offset.top - 10);
  }
};
