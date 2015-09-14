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
    $domNode.height($(window).height() - offset.top);
  }
};

export let AutosizeModalBody = {
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  handleResize() {
    let $domNode = $(this.getDOMNode());
    $(".modal-body", $domNode).height($(window).height() * 0.5);
  }
};