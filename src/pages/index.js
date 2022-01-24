import React, {useState, useMemo, useCallback, useEffect} from 'react'
import { MapContainer, LayersControl, TileLayer, Marker, Popup , Circle} from 'react-leaflet'

const center = [35.3608333,138.7275];
const zoom = 13

const GetCurrentPosition = ({setCurrentPos}) => {
  const success = (position) => {
    console.log(position)
    setCurrentPos(position)
  }

  const error = ()=> {
    console.log = 'Unable to retrieve your location';
  }

  const getPos = ()=>{
    if(!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log('Locating…')
      navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true});
    }
  }
  return (
    <button onClick={getPos}>
      GetCurrentPosition
    </button>
  )
}

const DisplayPosition = ({ map }) => {
  const [position, setPosition] = useState(map.getCenter())

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  return (
    <p>
      MapCenter [lat,lon]=[{position.lat.toFixed(4)},{position.lng.toFixed(4)}]
    </p>
  )
}

function MapPlaceholder() {
  return (
    <p>
      Loading map....{' '}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  )
}

export default function Index() {
  const [currentPos, setCurrentPos] = useState({coords:{latitude:center[0], longitude:center[1], accuracy:0}})
  const [map, setMap] = useState(null)
  const [getDate, setGetDate] = useState(null)
  useEffect(()=>{
    if (map) {
      map.flyTo([currentPos.coords.latitude, currentPos.coords.longitude])
      const timeStamp = new Date()
      timeStamp.setTime(currentPos.timestamp)
      setGetDate(timeStamp)
    }
  }, [map, currentPos])
  const displayMap = useMemo(
    () => (
      <>
        {(center[0] !== currentPos.coords.latitude && center[1] !== currentPos.coords.longitude)?<p>CurrentPosition [lon,lat]=[{currentPos.coords.latitude},{currentPos.coords.longitude}]</p>:null}
        {0 < currentPos.coords.accuracy?<p>Accuracy = {currentPos.coords.accuracy.toString()}[m]</p>:null}
        {0 < currentPos.timestamp?<p>GetAt {getDate.toString()}</p>:null}
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          whenCreated={setMap}
          placeholder={<MapPlaceholder />}
          style={{width: '90vw', height: '90vh', margin: '10px'}}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="地理院地図.標準">
              <TileLayer
                attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
              />      
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="地理院地図.淡色">
              <TileLayer
                attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
              />      
            </LayersControl.BaseLayer>
          </LayersControl>
          <Marker position={[currentPos.coords.latitude, currentPos.coords.longitude]}>
            <Popup>CurrentPosition</Popup>
          </Marker>
          {0 < currentPos.coords.accuracy? <Circle center={[currentPos.coords.latitude, currentPos.coords.longitude]} radius={currentPos.coords.accuracy}></Circle>:null}
        </MapContainer>
      </>
    ),
    [currentPos, getDate],
  )            
  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}        
      {map ? <GetCurrentPosition setCurrentPos = {setCurrentPos}/> : null}        
      {displayMap}
    </div>
  )
}