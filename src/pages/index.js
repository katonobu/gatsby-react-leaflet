import React, {useState, useMemo, useCallback, useEffect} from 'react'
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'

const center = [35.68, 139.76];
const zoom = 13

const DisplayPosition = ({ map }) => {
  const [position, setPosition] = useState(map.getCenter())

  const onClick = useCallback(() => {
    map.setView(center, zoom)
  }, [map])

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
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
      <button onClick={onClick}>reset</button>
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
  const [map, setMap] = useState(null)
  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        whenCreated={setMap}
        placeholder={<MapPlaceholder />}
        style={{width: '90vw', height: '90vh', margin: '10px'}}>        
        <TileLayer
          attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        />      
        <Marker position={center}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
      </MapContainer>
    ),
    [],
  )            
  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}        
      {displayMap}
    </div>
  )
}