import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ActionDone from 'material-ui/svg-icons/action/done';
import {withScriptjs,withGoogleMap,GoogleMap,Marker} from 'react-google-maps';
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import {compose, withProps,withHandlers} from 'recompose';

/*
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers } = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
*/

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            entries: []
            // entries: [{
            //     id: 1,
            //     hr: 60,
            //     br: 14,
            //     os: 98,
            //     longitude: -123.117113,
            //     latitude: 49.280882,
            // }, {
            //     id: 2,
            //     hr: 50,
            //     br: 12,
            //     os: 97,
            //     longitude: -123.12,
            //     latitude: 49.280882,
            // }, {
            //     id: 3,
            //     hr: 30,
            //     br: 4,
            //     os: 70,
            //     longitude: -123.12,
            //     latitude: 49.25,
            // }]
            // entries: []
        };

        this.removeElement = this.removeElement.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        
    }

    static childContextTypes =
        {
            muiTheme: PropTypes.object
        };

    // getFromDatabase() {
    //     fetch('http://localhost:6001/api/UpdateQ')
    //     .then(res => res.json())
    //     .then(data => {
    //         this.setState({ entries: data });
    //     });
    // }
    getChildContext()
    {
        return {
            muiTheme: getMuiTheme()
        }
    }

    componentWillMount() {
        this.setState({ entries: [] })
    }

    fetchDB() {
        const url =
            // Length issue
            'http://128.189.214.105:6001/api/UpdateQ'
        ;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                this.setState({ entries: data });
                //console.log(data);
            });
    }

    componentDidMount() {
        this.fetchDB();
        this.updateEntries();
    }

    updateEntries() {
        setInterval(() => this.fetchDB(), 3000);
    }

    removeElement(id) {
        const remainder = this.state.entries.filter(item => item["_id"] !==id);
        this.setState({entries: remainder});
    }

    renderListItem(val, key) {
        const string = `Heart Rate: ` + val["HR (BPM)"] + ` || Breathing Rate: ` + val["BR (Breaths/min)"] + ` || Oxygen Saturation: `+ val["O2SAT (%)"] + `%` + ` || Location: (` + val["Pos_X"] + `,` + val["Pos_Y"] + `)`;
        //window.alert(string);
        return <ListItem key={key} primaryText={"Id: " + val["_id"]} secondaryText={string} rightIconButton={<IconButton value={val["_id"]} onClick={() => this.removeElement(val["_id"])}> <ActionDone /> </IconButton>}/>
    }

    render() {
        const MapWithAMarkerClusterer = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
                loadingElement: <div style={{ height: `100%` }} />,
                containerElement: <div style={{ height: `400px` }} />,
                mapElement: <div style={{ height: `100%` }} />,
            }),
            withHandlers({
                onMarkerClustererClick: () => (markerClusterer) => {
                    const clickedMarkers = markerClusterer.getMarkers();
                    console.log(`Current clicked markers length: ${clickedMarkers.length}`);
                    console.log(clickedMarkers)
                },
            }),
            withScriptjs,
            withGoogleMap
        )(props =>
            <GoogleMap
                defaultZoom={10}
                defaultCenter={{ lat: 49.280882, lng: -123.117113 }}
            >
                <MarkerClusterer
                    onClick={props.onMarkerClustererClick}
                    averageCenter
                    enableRetinaIcons
                    gridSize={60}
                >
                    {props.entries.map(marker => (
                        <Marker
                            key={marker.id}
                            position={{ lat: marker.Pos_X, lng: marker.Pos_Y }}
                        />
                    ))}
                </MarkerClusterer>
            </GoogleMap>
        );
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome</h1>
                </header>
                <p className="Queue-Title">
                    Patient Queue:
                </p>
                <div>
                    <Divider />
                    <List>
                        {this.state.entries.map(this.renderListItem)}
                    </List>
                    <Divider />
                </div>
                <p className="HeatMap-Title">
                    Patient Map:
                </p>
                <MapWithAMarkerClusterer entries = {this.state.entries}/>
            </div>
        )
    }
}

/*
                <GoogleMapReact
                    //apiKey={AIzaSyDxOPb3ygWrIu4XjuwQIAAm8oAWkl3RxT4} // set if you need stats etc ...
                    bootstrapURLKeys={{libraries: 'visualization',}}
                    defaultCenter={[49.280882, -123.117113]}
                    defaultZoom={6}
                    yesIWantToUseGoogleMapApiInternals={({map, maps}) => {
                        //console.log(points[0]);
                        const heatmap = new maps.visualization.HeatmapLayer({
                            data : points.map(point => (
                                {location : new maps.LatLng(points['location'][0], points['location'][1]),
                                weight: points['weight']}))
                        });
                        heatmap.setMap(map);
                    }}
                    >
            </GoogleMapReact>

<MyMapComponent
    isMarkerShown={false}
    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px` }} />}
    mapElement={<div style={{ height: `100%` }} />}
/>*/
/*  renderListItem(val, key) {
    return <ListItem key={key} value={val} />
  }

  render() {
    const stringList = [[1,3,4,5], [1,2,3,4], [1,2,3,4]];

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome</h1>
      </header>
        <p className="Queue-Title">
          Patient Queue:
        </p>
        {stringList.map(this.renderListItem)}
      </div>

    );
  }
} */

export default App;
