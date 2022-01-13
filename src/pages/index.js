import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react'
import { MapContainer, LayersControl, TileLayer, Marker, Popup, Polygon} from 'react-leaflet'
import {higashitotukasho, maichu, totukaku, yoshidayabe} from "../components/lines"
import hyaku_meisan from '../components/hyakumeisan';

const center = [35.3608333,138.7275];
const zoom = 13

const limeOptions = { color: 'lime' }
const purpleOptions = { color: 'purple' }
const redOptions = { color: 'red' }

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
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
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

function Markers({name_poses}) {
  return (
    name_poses.map((name_pos, index) => {
      return (
<Marker position={name_pos.pos} key={index}>
    <Popup>
        {name_pos.name}
    </Popup>
</Marker>
      )
    }        
)
  )
}

function FlyHyakumeisan({map, name_poses}) {
  const [flying, setFlying] = useState(false)
  const [currentName, setCurrentName] = useState("")
  const timerRef = useRef()
  const indexRef = useRef()

  const onClick = ()=>{
    if (flying) {
      clearInterval(timerRef.current)
      setFlying(()=>false)
      setCurrentName(()=>"")
    } else {
      indexRef.current = 0
      timerRef.current = setInterval(() => {
        console.log("Fly to " + name_poses[indexRef.current].name)
        setCurrentName(()=>name_poses[indexRef.current].name)
        map.flyTo(name_poses[indexRef.current].pos)
        indexRef.current += 1
        if (indexRef.current === 100) {
          clearInterval(timerRef.current)
          setFlying(()=>false)
          setCurrentName(()=>"")
        }
      }, 5000)
      console.log("Fly to " + name_poses[indexRef.current].name)
      setCurrentName(()=>name_poses[indexRef.current].name)
      map.flyTo(name_poses[indexRef.current].pos)
      indexRef.current += 1
      setFlying(()=>true)
    }
  }

  return (
    <p>
      <button onClick={onClick}>{flying?"STOP":"START"}</button>
      {currentName}
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
          <LayersControl.BaseLayer name="地理院地図.白地図">
            <TileLayer
              attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
              url="https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png"
            />      
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap.Mapnik">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="戸塚区">
            <Polygon pathOptions={purpleOptions} positions={totukaku} />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="東戸塚小学区">
            <Polygon pathOptions={limeOptions} positions={higashitotukasho} />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="舞岡中学区">
            <Polygon pathOptions={redOptions} positions={maichu} />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="吉田矢部地区">
            <Polygon pathOptions={redOptions} positions={yoshidayabe} />
          </LayersControl.Overlay>
        </LayersControl>
        <Markers name_poses = {hyaku_meisan}></Markers>
      </MapContainer>
    ),
    [],
  )            
  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}        
      {map ? <FlyHyakumeisan map={map} name_poses = {hyaku_meisan}/> : null}        
      {displayMap}
    </div>
  )
}