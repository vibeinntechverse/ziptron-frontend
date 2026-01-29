declare module 'react-native-maps-directions' {
  import { Component } from 'react';
  import { MapViewProps } from 'react-native-maps';

  export interface MapViewDirectionsProps {
    origin?: any;
    destination?: any;
    apikey: string;
    onReady?: (result: any) => void;
    onError?: (errorMessage: string) => void;
    mode?: 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING';
    language?: string;
    resetOnChange?: boolean;
    optimizeWaypoints?: boolean;
    splitWaypoints?: boolean;
    directionsServiceBaseUrl?: string;
    region?: string;
    precision?: 'high' | 'low';
    timePrecision?: 'now' | 'none';
    channel?: string;
    strokeWidth?: number;
    strokeColor?: string;
    lineDashPattern?: number[];
  }

  export default class MapViewDirections extends Component<MapViewDirectionsProps> {}
}