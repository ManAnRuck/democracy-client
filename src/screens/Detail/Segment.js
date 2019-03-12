import React, { Component } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import CollapseIcon from '../../components/Icons/Collapse';

const Wrapper = styled.View``;

const SegmentTouch = styled.TouchableHighlight.attrs(() => ({
  activeOpacity: 0.5,
  underlayColor: 'rgba(68, 148, 211, 0.1)',
}))``;

const SegmentWrapper = styled.View`
  padding-vertical: 10;
  padding-horizontal: 18;
  flex-direction: row;
  border-bottom-width: 1;
  border-bottom-color: rgba(68, 148, 211, 0.1);
  align-items: center;
`;

const Title = styled.Text`
  flex: 1;
  font-size: 18;
`;

const Content = styled.View`
  display: ${({ open, collapsible }) => (open || !collapsible ? 'flex' : 'none')};
  padding-horizontal: ${({ fullWidth }) => (fullWidth ? 0 : 18)};
  padding-vertical: 10;
`;

class Segment extends Component {
  state = {
    open: false,
  };

  componentWillMount() {
    const { open } = this.props;
    if (open) {
      this.setState({ open });
    }
  }

  onLayout = ({
    nativeEvent: {
      layout: { y, height },
    },
  }) => {
    const { scrollTo } = this.props;
    if (this.fireScroll && scrollTo) {
      this.fireScroll = false;
      setTimeout(() => {
        scrollTo({ y, height });
      }, 100);
    }
  };

  toggle = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        this.fireScroll = true;
      }
    });
  };

  render() {
    const { title, collapsible, fullWidth } = this.props;
    const { open } = this.state;
    return (
      <Wrapper onLayout={this.onLayout}>
        <SegmentTouch onPress={this.toggle}>
          <SegmentWrapper>
            <Title>{title}</Title>
            {collapsible && <CollapseIcon open={open} />}
          </SegmentWrapper>
        </SegmentTouch>
        <Content open={open} collapsible={collapsible} fullWidth={fullWidth}>
          {open && this.props.children}
        </Content>
      </Wrapper>
    );
  }
}

Segment.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool,
  collapsible: PropTypes.bool,
  children: PropTypes.node.isRequired,
  scrollTo: PropTypes.func,
  fullWidth: PropTypes.bool,
};

Segment.defaultProps = {
  collapsible: true,
  open: false,
  fullWidth: false,
  scrollTo: () => {},
};

export default Segment;
