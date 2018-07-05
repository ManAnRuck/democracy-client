import React, { Component } from "react";
import { View, Dimensions, Platform } from "react-native";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import {
  VictoryChart,
  VictoryBar,
  VictoryStack,
  VictoryAxis,
  VictorySharedEvents,
  VictoryGroup,
  VictoryTheme
} from "victory-native";
import victoryAxis from "victory-native/lib/components/victory-axis";

const VoteResultsWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const VoteResultsPieWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const VoteResultPieValue = styled.Text`
  font-size: 17;
  color: #4a4a4a;
`;

const VoteResultPieLabel = styled.Text`
  font-size: 11;
  color: #4a4a4a;
  padding-top: 3;
`;

const VoteResultNumbers = styled.View`
  width: ${() => Dimensions.get("window").width - 18 * 2};
  max-width: 464;
  padding-top: 18;
  flex-direction: row;
  justify-content: space-around;
`;

const VoteResult = styled.View`
  justify-content: center;
  align-items: center;
`;

const VoteResultCircleNumber = styled.View`
  flex-direction: row;
`;

const VoteResultNumber = styled.Text`
  color: #4a4a4a;
  font-size: 12;
`;
const VoteResultLabel = styled.Text`
  color: #d5d5d5;
  font-size: 10;
`;

const VoteResultCircle = styled.View`
  width: 10;
  height: 10;
  border-radius: 5;
  background-color: ${props => props.color};
  margin-top: 3;
  margin-right: 5;
`;

const TouchableBar = styled.TouchableOpacity`
  background-color: red;
`;

const AxisLabel = styled.Text``;

class PieChart extends Component {
  state = {
    width: Dimensions.get("window").width - 18 * 2
  };

  getColor = (label, colors) => {
    switch (label) {
      case "yes":
        return colors[0];
      case "abstination":
        return colors[1];
      case "no":
        return colors[2];
      default:
        return colors[3];
    }
  };

  getLabel = label => {
    const labels = {
      yes: "Zustimmungen",
      abstination: "Enthaltungen",
      no: "Ablehnungen",
      notVoted: "Nicht abg."
    };
    return labels[label] || label;
  };

  getTotals = data => {
    const totals = data.reduce(
      (prev, party) => {
        const { yes, abstination, no, notVoted } = party.value;
        return {
          yes: prev.yes + yes,
          abstination: prev.abstination + abstination,
          no: prev.no + no,
          notVoted: prev.notVoted + notVoted
        };
      },
      { yes: 0, abstination: 0, no: 0, notVoted: 0 }
    );
    return [
      {
        label: "yes",
        value: totals.yes
      },
      {
        label: "abstination",
        value: totals.abstination
      },
      {
        label: "no",
        value: totals.no
      },
      {
        label: "notVoted",
        value: totals.notVoted
      }
    ];
  };

  prepareChartData = data => {
    const chartData = data.reduce(
      (prev, party) => {
        const { yes, abstination, no, notVoted } = party.value;
        const total = yes + abstination + no + notVoted;
        // yes
        prev[0].push({
          x: party.label,
          y: party.value.yes / total,
          fillColor: "#99c93e"
        });
        // abstination
        prev[1].push({
          x: party.label,
          y: party.value.abstination / total,
          fillColor: "#4cb0d8"
        });
        // no
        prev[2].push({
          x: party.label,
          y: party.value.no / total,
          fillColor: "#d43194"
        });
        // notVoted
        prev[3].push({
          x: party.label,
          y: party.value.notVoted / total,
          fillColor: "#b1b3b4"
        });
        // nix
        return prev;
      },
      [[], [], [], []]
    );
    return chartData;
  };

  labelStyle = (...rest) => {
    console.log(rest);
    return {
      color: "blue"
    };
  };

  render() {
    const { data, colorScale, label, showNumbers } = this.props;
    const { width } = this.state;
    const dataSet = this.prepareChartData(data);
    console.log({ dataSet });
    return (
      <VoteResultsWrapper
        onLayout={({ nativeEvent: { layout: { width: newWidth } } }) =>
          this.setState({ width: newWidth - 18 * 2 })
        }
      >
        <VoteResultsPieWrapper>
          <VictoryChart padding={{ left: 80, top: 20, bottom: 20, right: 20 }}>
            <VictoryStack horizontal maxDomain={{ x: 1 }}>
              {dataSet.map((chartData, i) => (
                <VictoryBar
                  // width={340}
                  key={chartData[0].y}
                  name={`bar-${i}`}
                  barRatio={0.8}
                  data={chartData.reverse()}
                  style={{
                    data: {
                      fill: d => {
                        if (!d.fillColor) {
                          console.log("STYLE VictoryBar", d);
                        }
                        return d.fillColor;
                      }
                    },
                    labels: {
                      axis: { stroke: "none" }
                    }
                  }}
                />
              ))}
            </VictoryStack>
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: "none" },
                tickLabels: { fontWeight: "100", padding: 5 }
              }}
            />
          </VictoryChart>
        </VoteResultsPieWrapper>
        {showNumbers && (
          <VoteResultNumbers>
            {this.getTotals(data).map(entry => (
              <VoteResult key={entry.label}>
                <VoteResultCircleNumber>
                  <VoteResultCircle
                    color={this.getColor(entry.label, colorScale)}
                  />
                  <VoteResultNumber>
                    {entry.value !== null ? entry.value : "?"}
                  </VoteResultNumber>
                </VoteResultCircleNumber>
                <VoteResultLabel>{this.getLabel(entry.label)}</VoteResultLabel>
              </VoteResult>
            ))}
          </VoteResultNumbers>
        )}
      </VoteResultsWrapper>
    );
  }
}

PieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  label: PropTypes.string.isRequired,
  colorScale: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  showNumbers: PropTypes.bool
};

PieChart.defaultProps = {
  showNumbers: true
};

export default PieChart;
