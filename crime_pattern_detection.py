import pandas as pd
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from geopy.geocoders import Nominatim
import folium

import os

# Load crime data
df = pd.read_csv('crime_data.csv')


# Clean data
df = df[~df['location'].isin(['undefined', ''])]
df['type'] = df['type'].replace('undefined', 'unknown')
df['date'] = df['date'].fillna('unknown')

# Load or create geocoding cache
cache_file = 'location_cache.csv'
if os.path.exists(cache_file):
    cache_df = pd.read_csv(cache_file)
else:
    cache_df = pd.DataFrame(columns=['location', 'latitude', 'longitude'])

geolocator = Nominatim(user_agent="crime_analyzer")

def get_lat_lng(loc):
    global cache_df  # Declare global at the very top
    
    # Check if location is already cached
    cached = cache_df[cache_df['location'] == loc]
    if not cached.empty:
        return cached.iloc[0]['latitude'], cached.iloc[0]['longitude']
    
    # If not cached, geocode it
    try:
        location = geolocator.geocode(loc)
        if location:
            lat, lng = location.latitude, location.longitude
            # Add to cache
            cache_df.loc[len(cache_df)] = [loc, lat, lng]
            cache_df.to_csv(cache_file, index=False)  # Save cache file
            return lat, lng
        else:
            return None, None
    except:
        return None, None



# Get latitudes and longitudes using cache
latitudes = []
longitudes = []

for loc in df['location']:
    lat, lng = get_lat_lng(loc)
    latitudes.append(lat)
    longitudes.append(lng)

df['latitude'] = latitudes
df['longitude'] = longitudes

# Remove entries with missing coordinates
df = df.dropna(subset=['latitude', 'longitude'])

# Run KMeans clustering
kmeans = KMeans(n_clusters=3, random_state=42)
df['cluster'] = kmeans.fit_predict(df[['latitude', 'longitude']])

# Save clustered data
df.to_csv('crime_data_clustered.csv', index=False)
print("Clustered data saved to crime_data_clustered.csv")

# Plot clusters
plt.figure(figsize=(8, 6))
plt.scatter(df['longitude'], df['latitude'], c=df['cluster'], cmap='viridis', s=50)
plt.title("Crime Hotspots")
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.grid(True)

plt.savefig('crime_hotspots.png')
print("Crime hotspots plot saved as crime_hotspots.png")





# Create a base map centered on the average coordinates
map_center = [df['latitude'].mean(), df['longitude'].mean()]
m = folium.Map(location=map_center, zoom_start=10)

# Cluster colors
colors = ['red', 'blue', 'green', 'purple', 'orange', 'darkred', 'lightblue', 'beige']

# Add points with popups
for idx, row in df.iterrows():
    folium.CircleMarker(
        location=[row['latitude'], row['longitude']],
        radius=6,
        popup=f"Location: {row['location']}<br>Type: {row['type']}<br>Date: {row['date']}",
        color=colors[row['cluster'] % len(colors)],
        fill=True,
        fill_color=colors[row['cluster'] % len(colors)]
    ).add_to(m)

# Save the interactive map
m.save('crime_hotspots_map.html')
print("Interactive map saved as crime_hotspots_map.html")

plt.show()
