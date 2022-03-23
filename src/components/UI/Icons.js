import favIcon from "../../assets/goldIcon.png";
import normalIcon from "../../assets/redIcon.png";
import L from "leaflet";

const Icon = L.Icon.extend({
  options: {
    iconSize: [58, 58],
    shadowSize: [50, 64],
    iconAnchor: [30, 20],
    shadowAnchor: [4, 62],
    popupAnchor: [0, 0],
  },
});

export const goldIcon = new Icon({
  iconUrl: favIcon,
});
export const redIcon = new Icon({
  iconUrl: normalIcon,
});
