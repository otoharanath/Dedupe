import React from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { geoPath } from 'd3-geo';
import { chartColors } from '../utils/colors';
import { usStatesNew } from './us-states';
import * as topojson from 'topojson-client';



class USAMap extends React.Component {
  state = {
    tooltip: {
      label: '',
      region: '',
      value: ''
    }
  };

   chartContainer = React.createRef();
   tooltipContainer = React.createRef();
   colorScheme = [
    chartColors.blue,
    chartColors.green,
    chartColors.maroon,
    chartColors.orange,
    chartColors.purple,
    chartColors.yellow,
    chartColors.red
  ];
   USStateAbbvr = {
    AL: 'Alabama',
    AK: 'Alaska',
    AS: 'American Samoa',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District Of Columbia',
    FM: 'Federated States Of Micronesia',
    FL: 'Florida',
    GA: 'Georgia',
    GU: 'Guam',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MH: 'Marshall Islands',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    MP: 'Northern Mariana Islands',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PW: 'Palau',
    PA: 'Pennsylvania',
    PR: 'Puerto Rico',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VI: 'Virgin Islands',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming'
  };

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.drawMap(this.massageData());
    }
  }

  massageData = () => {
    const { data } = this.props;
    const regionsObj = {};
    const dataJson = JSON.parse(data);
    const sampleData = {};
    [
      'HI',
      'AK',
      'FL',
      'SC',
      'GA',
      'AL',
      'NC',
      'TN',
      'RI',
      'CT',
      'MA',
      'ME',
      'NH',
      'VT',
      'NY',
      'NJ',
      'PA',
      'DE',
      'MD',
      'WV',
      'KY',
      'OH',
      'MI',
      'WY',
      'MT',
      'ID',
      'WA',
      'DC',
      'TX',
      'CA',
      'AZ',
      'NV',
      'UT',
      'CO',
      'NM',
      'OR',
      'ND',
      'SD',
      'NE',
      'IA',
      'MS',
      'IN',
      'IL',
      'MN',
      'WI',
      'MO',
      'AR',
      'OK',
      'KS',
      'LS',
      'LA',
      'PR',
      'VA'
    ].forEach(d => {
      const stateDataObject = dataJson[this.USStateAbbvr[d]];
      const stateData = (stateDataObject && stateDataObject.count) || 0;
      const regionData = (stateDataObject && stateDataObject.region) || '';
      regionsObj[regionData.toLowerCase()] = true;
      sampleData[d] = {
        count: stateData,
        region: regionData
      };
    });
    return { data: sampleData, regions: Object.keys(regionsObj) };
  };

  drawMap = options => {
    const data = options.data;
    const mouseOver = (d, i, nodes) => {
      const coords = d3.mouse(nodes[i]);
      d3.select(this.tooltipContainer.current)
        .transition()
        .duration(200)
        .style('opacity', 0.9);

      d3.select(this.tooltipContainer.current)
        .style('left', coords[0] - 50 + 'px')
        .style('top', coords[1] + 'px');
      this.setState({
        tooltip: {
          label: d.properties.NAME,
          region: data[d.properties.STUSPS].region,
          value: data[d.properties.STUSPS].count
        }
      });
    };

    const mouseOut = () => {
      d3.select(this.tooltipContainer.current)
        .transition()
        .duration(500)
        .style('opacity', 0);
    };

    const feature = topojson.feature(
      usStatesNew,
      usStatesNew.objects.states_20m_2017
    );

    d3.select(this.chartContainer.current)
      .selectAll('svg')
      .remove();

    const aspect_ratio = 0.5;
    const width =
      (this.chartContainer.current &&
        this.chartContainer.current.offsetWidth) ||
      0;

    const height = width * aspect_ratio;

    const projection = d3
      .geoAlbersUsa()
      .scale(width)
      .translate([width / 2, height / 2]);
    const path = geoPath().projection(projection);
    const svg = d3
      .select(this.chartContainer.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .selectAll('.state')
      .data(feature.features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', path)
      .style('fill', d => {
        if (data[d.properties.STUSPS]) {
          const stateInfoData = data[d.properties.STUSPS];
          if (!!stateInfoData.region) {
            return this.colorScheme[
              options.regions.indexOf(
                data[d.properties.STUSPS].region.toLowerCase()
              )
            ];
          } else {
            return chartColors.grey;
          }
        } else {
          console.log(d.properties.STUSPS);
        }
      })
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut);
  };

   render() {
    const { tooltip } = this.state;
    return (
      <ChartsContainer>
        <MapContainer ref={this.chartContainer}></MapContainer>
        <TooltipContainer id="tooltip" ref={this.tooltipContainer}>
          {tooltip && (
            <div>
              <div>{`State: ${tooltip && tooltip.label}`}</div>
              <div>{`Region: ${tooltip && tooltip.region}`}</div>
              <div>{`Count: ${tooltip && tooltip.value}`}</div>
            </div>
          )}
        </TooltipContainer>
      </ChartsContainer>
    );
  }
}

const TooltipContainer = styled.div`
  position: absolute;
  text-align: left;
  margin: 10px;
  font: 12px sans-serif;
  background: lightsteelblue;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid grey;
  border-radius: 5px;
  font-size: 12px;
  width: auto;
  padding: 4px;
  color: white;
  opacity: 0;
  display: flex;
  flex-flow: column;
`;

const ChartsContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .state {
    fill: none;
    stroke: #a9a9a9;
    stroke-width: 1;
  }
  .state:hover {
    fill-opacity: 0.5;
  }
`;

export default USAMap;
