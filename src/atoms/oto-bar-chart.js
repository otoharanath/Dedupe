import React from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import colors, { chartColors } from '../components/utils/colors';


class OtoBarChart extends React.Component {
  state = { renderReady: false };
   chartContainer = React.createRef();
  static defaultProps = {
    diffLabel: 'unknown',
    color: chartColors.green,
    diffColor: chartColors.yellow
  };
  componentDidMount() {
    this.setState({
      renderReady: true
    });
  }
  componentDidUpdate() {
    this.prepareChart();
  }
  customDisplayNumber = num => {
    return num;
  };
  prepareChart = () => {
    const { data, color } = this.props;
    const preChartData = typeof data === 'string' ? JSON.parse(data) : data;
    const chartData = Object.keys(preChartData).map(d => ({
      label: d,
      value: preChartData[d]
    }));
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const chartWidth =
      (this.chartContainer.current &&
        this.chartContainer.current.offsetWidth) ||
      0;

    const chartHeight = 343;
      

    const height = Number(chartHeight - margin.top - margin.bottom) ;
    const width = Number(chartWidth - margin.left - margin.right) ;

    const getValue = d => d.value;

    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.5);

    const y = d3.scaleLinear().range([height, 0]);

    // const colorZone = d3
    //   .scaleLinear()
    //   .domain([
    //     d3.min(data, getValue),
    //     d3.median(data, getValue),
    //     d3.max(data, getValue)
    //   ])
    //   .range([startColor, midColor, endColor])
    //   .interpolate(d3.interpolateHcl);

    d3.select(this.chartContainer.current)
      .selectAll('svg')
      .remove();

    const svg = d3
      .select(this.chartContainer.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain(chartData.map(d => d.label));
    y.domain([0, d3.max(chartData, getValue)]);

    svg
      .selectAll('.bar')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
      .style('fill', d =>
        d.label === this.props.diffLabel ? this.props.diffColor : color
      );

    // add the x Axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append('g').call(d3.axisLeft(y).tickFormat(d3.format('~s')));
  };
   render() {
    const { className } = this.props;
    return <div ref={this.chartContainer} className={className}></div>;
  }
}
const StyledOtoBarChart = styled(OtoBarChart)`
  height: 100%;
  width: 100%;
  .axis {
    font: 10px sans-serif;
  }
  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }
`;
export default StyledOtoBarChart;
