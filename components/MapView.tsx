import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Post } from '../types';
import { Search, Locate, Loader2, Send, Layers, RefreshCw } from 'lucide-react';

interface MapViewProps {
  posts: Post[];
  onConnect: (userName: string) => void;
}

// Declare Leaflet global
declare global {
  interface Window {
    L: any;
  }
}

const MapView: React.FC<MapViewProps> = ({ posts, onConnect }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<any>(null); // Ref to hold the tile layer
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const hasCenteredRef = useRef(false);
  
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'paid' | 'tennis' | 'gym'>('all');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.locationName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'free') return !post.isPaid;
      if (activeFilter === 'paid') return post.isPaid;
      if (activeFilter === 'tennis') return post.sport.toLowerCase() === 'tennis';
      if (activeFilter === 'gym') return post.sport.toLowerCase() === 'gym';
      
      return true;
    });
  }, [posts, searchQuery, activeFilter]);

  // Function to get real location
  const handleLocateMe = (force: boolean = false) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    if (!force && userLocation) return;

    setIsLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc: [number, number] = [latitude, longitude];
        setUserLocation(newLoc);
        setIsLoadingLoc(false);
        hasCenteredRef.current = true;

        if (mapRef.current) {
          mapRef.current.flyTo(newLoc, 15, {
              animate: true,
              duration: 1.5
          });
          
          if (userMarkerRef.current) {
             userMarkerRef.current.setLatLng(newLoc);
          }
        }
      },
      (error) => {
        console.error("Error getting location", error);
        setIsLoadingLoc(false);
        if (force) alert("Unable to retrieve your location. Please check permissions.");
        
        if(!userLocation) {
            const defaultLoc: [number, number] = [40.785091, -73.968285];
            setUserLocation(defaultLoc);
            if (mapRef.current && !hasCenteredRef.current) {
                mapRef.current.setView(defaultLoc, 14);
            }
        }
      }
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network request
    setTimeout(() => {
        setIsRefreshing(false);
        // In a real app, this would re-fetch data from the API
    }, 1500);
  };

  // Toggle Map Style
  const toggleMapStyle = () => {
    const newStyle = mapStyle === 'street' ? 'satellite' : 'street';
    setMapStyle(newStyle);
    
    if (tileLayerRef.current) {
        const url = newStyle === 'street' 
            ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        
        // Attribution updates
        const attribution = newStyle === 'street'
            ? '&copy; OpenStreetMap &copy; CARTO'
            : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
            
        tileLayerRef.current.setUrl(url);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    if (window.L) {
        const initialLat = 40.785091;
        const initialLng = -73.968285;

        const map = window.L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView([initialLat, initialLng], 14);

        // Create Tile Layer and save ref
        const tileLayer = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);
        
        tileLayerRef.current = tileLayer;
        mapRef.current = map;

        if (!hasCenteredRef.current) {
            handleLocateMe(false);
        }

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    
    const map = mapRef.current;
    const L = window.L;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    if (userLocation) {
        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng(userLocation);
        } else {
            const userIcon = L.divIcon({
                className: 'custom-div-icon',
                html: '<div class="user-pulse"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(map);
        }
    }

    const center = userLocation || [40.785091, -73.968285];
    const livePosts = filteredPosts.filter(p => p.locationType === 'live');

    livePosts.forEach((post) => {
        const idNum = post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        let lat, lng;
        
        if (post.coordinates && post.coordinates.x) {
             lat = center[0] + (post.coordinates.x - 50) * 0.0005;
             lng = center[1] + (post.coordinates.y - 50) * 0.0005;
        } else {
             const latOffset = (Math.sin(idNum) * 0.008);
             const lngOffset = (Math.cos(idNum) * 0.008);
             lat = center[0] + latOffset;
             lng = center[1] + lngOffset;
        }

        const pinColor = post.isPaid ? '#f59e0b' : '#3b82f6';
        const isSelected = selectedPin === post.id;

        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div class="relative w-10 h-10 transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'}">
                <div style="background-color: ${pinColor}" class="absolute w-full h-full rounded-full opacity-20 animate-ping"></div>
                <div class="marker-pin" style="background-color: ${pinColor}"></div>
                <img src="${post.user.avatar}" class="marker-img" />
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 42]
        });

        const marker = L.marker([lat, lng], { icon: customIcon })
            .addTo(map)
            .on('click', () => {
                setSelectedPin(post.id);
                map.flyTo([lat + 0.0015, lng], 16, { duration: 0.8 });
            });
        
        markersRef.current.push(marker);
    });

  }, [filteredPosts, selectedPin, userLocation]);

  const FilterButton = ({ label, id }: { label: string, id: typeof activeFilter }) => (
    <button 
        onClick={() => setActiveFilter(id)}
        className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm whitespace-nowrap transition-all ${
            activeFilter === id 
            ? 'bg-blue-600 text-white shadow-blue-200' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
        }`}
    >
        {label}
    </button>
  );

  return (
    <div className="relative w-full h-full bg-gray-100 flex flex-col font-sans">
      
      {/* Search Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[400] p-4 bg-gradient-to-b from-white/90 to-transparent space-y-3 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3.5 border border-gray-100 pointer-events-auto">
          <Search className="text-gray-400 w-5 h-5 mr-3" />
          <input 
            type="text" 
            placeholder="Search sport, coach, or place..." 
            className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-500 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pointer-events-auto">
            <FilterButton label="All" id="all" />
            <FilterButton label="Free" id="free" />
            <FilterButton label="Paid" id="paid" />
            <FilterButton label="Tennis" id="tennis" />
            <FilterButton label="Gym" id="gym" />
        </div>
      </div>

      {/* Map Container */}
      <div id="map-container" ref={mapContainerRef} className="flex-1 w-full h-full z-0 outline-none" />
      
      {/* Map Controls Group (Right Side) */}
      <div className="absolute bottom-40 right-4 z-[400] flex flex-col gap-3">
        {/* Refresh Button */}
        <button 
            className="bg-white p-3.5 rounded-2xl shadow-xl text-blue-600 border border-gray-100 active:scale-95 transition-transform"
            onClick={handleRefresh}
        >
            <RefreshCw size={24} className={isRefreshing ? "animate-spin" : ""} />
        </button>

        {/* Style Toggle */}
        <button 
            className="bg-white p-3.5 rounded-2xl shadow-xl text-gray-700 border border-gray-100 active:scale-95 transition-transform"
            onClick={toggleMapStyle}
        >
            <Layers size={24} className={mapStyle === 'satellite' ? 'text-blue-600' : 'text-gray-600'} />
        </button>

        {/* Recenter Button */}
        <button 
            className="bg-white p-3.5 rounded-2xl shadow-xl text-blue-600 border border-gray-100 active:scale-95 transition-transform"
            onClick={() => handleLocateMe(true)}
        >
            {isLoadingLoc ? <Loader2 size={24} className="animate-spin" /> : <Locate size={24} />}
        </button>
      </div>

      {/* Selected Pin Info Card */}
      {selectedPin && (
          <div className="absolute bottom-28 left-4 right-4 bg-white/95 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-2xl border border-white/50 animate-slide-up z-[500] ring-1 ring-black/5">
             {filteredPosts.find(p => p.id === selectedPin) && (
                 (() => {
                    const p = filteredPosts.find(post => post.id === selectedPin)!;
                    return (
                        <div className="flex items-start gap-3.5">
                            <div className="relative flex-shrink-0">
                                <img src={p.user.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-md ring-2 ring-white" />
                                {p.user.isOnline && <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-900 truncate text-lg">{p.user.name}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{p.createdAt}</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mt-1 leading-snug font-medium pr-6">{p.content}</p>
                                <div className="flex flex-wrap gap-2 mt-3.5">
                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide">{p.sport}</span>
                                    {p.isPaid ? (
                                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg font-bold flex items-center">
                                            ₹ {p.price}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-bold">Free</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <button 
                                    onClick={() => onConnect(p.user.name)}
                                    className="flex flex-col items-center justify-center bg-blue-600 text-white w-14 h-14 rounded-2xl shadow-blue-200 shadow-lg hover:bg-blue-700 transition-colors active:scale-95"
                                >
                                    <Send size={20} className="mb-0.5" />
                                    <span className="text-[9px] font-bold">Connect</span>
                                </button>
                            </div>
                        </div>
                    )
                 })()
             )}
             <button 
                onClick={(e) => { e.stopPropagation(); setSelectedPin(null); }}
                className="absolute top-2 right-2 bg-gray-100 rounded-full p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-200 transition-colors"
             >
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
             </button>
          </div>
      )}
    </div>
  );
};

export default MapView;