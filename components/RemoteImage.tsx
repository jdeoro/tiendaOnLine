  import React, { useState } from 'react';
import { ActivityIndicator, Image, ImageStyle, StyleProp, View } from 'react-native';
  
  export const RemoteImage = ({ uri, style }: { uri: string; style?: StyleProp<ImageStyle> }) => {
    const [loading, setLoading] = useState(true);
    return (
      <View style={style}>
        {loading && (
          <ActivityIndicator
            size="small"
            color="#999"
            style={style && (style as any).remoteImage}
          />
        )}
        <Image
          source={{ uri }}
          style={style}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    );
  };