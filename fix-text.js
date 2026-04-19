AFRAME.registerComponent('nft-label', {
  schema: {
    title: {type: 'string', default: ''},
    owner: {type: 'string', default: ''},
    tokenid: {type: 'string', default: ''}
  },
  init: function() {
    const t = this.data;
    this.el.setAttribute('text', {
      value: `#${t.tokenid}  ${t.title}\n${t.owner}`,
      align: 'center',
      color: '#FFD700',
      width: 2,
      wrapCount: 20,
      baseline: 'top'
    });
  }
});
