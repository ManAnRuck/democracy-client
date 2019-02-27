import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import PartyChartComponent from '../../../../../components/Charts/PartyChart';
import ChartLegend from '../../../../../components/Charts/ChartLegend';

const Wrapper = styled.View`
  align-items: center;
`;

class PartyChartGov extends PureComponent {
  state = {
    partyChartSelected: 0,
  };

  partyChartClick = index => () => {
    this.setState({ partyChartSelected: index });
  };

  render() {
    const { partyChartSelected } = this.state;
    const { chartData, ...props } = this.props;
    return (
      <Wrapper>
        <PartyChartComponent
          chartData={chartData}
          {...props}
          onClick={this.partyChartClick}
          selected={partyChartSelected}
        />
        <ChartLegend data={chartData[partyChartSelected].values} />
      </Wrapper>
    );
  }
}

PartyChartGov.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

PartyChartGov.defaultProps = {};

export default PartyChartGov;
