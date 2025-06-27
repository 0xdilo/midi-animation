import * as THREE from 'three';

export class GeometryOptimizer {
  static cache = new Map();
  static materialCache = new Map();

  static optimizeGeometry(geometry) {
    if (!geometry) return geometry;
    
    // Create a hash key for the geometry
    const key = this.getGeometryHash(geometry);
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Clone and optimize
    const optimized = geometry.clone();
    
    // Merge vertices to reduce complexity
    if (optimized.attributes.position) {
      optimized.setAttribute('position', 
        new THREE.Float32BufferAttribute(
          this.compressFloatArray(optimized.attributes.position.array), 
          3
        )
      );
    }

    // Simplify normals
    if (optimized.attributes.normal) {
      optimized.setAttribute('normal', 
        new THREE.Float32BufferAttribute(
          this.compressFloatArray(optimized.attributes.normal.array), 
          3
        )
      );
    }

    // Compress UV coordinates
    if (optimized.attributes.uv) {
      optimized.setAttribute('uv', 
        new THREE.Float32BufferAttribute(
          this.compressFloatArray(optimized.attributes.uv.array, 0.01), 
          2
        )
      );
    }

    // Remove unused attributes
    const keepAttributes = ['position', 'normal', 'uv'];
    const toRemove = [];
    
    for (const name in optimized.attributes) {
      if (!keepAttributes.includes(name)) {
        toRemove.push(name);
      }
    }
    
    toRemove.forEach(name => optimized.deleteAttribute(name));

    this.cache.set(key, optimized);
    return optimized;
  }

  static compressFloatArray(array, precision = 0.001) {
    const compressed = new Float32Array(array.length);
    for (let i = 0; i < array.length; i++) {
      compressed[i] = Math.round(array[i] / precision) * precision;
    }
    return compressed;
  }

  static getGeometryHash(geometry) {
    if (!geometry.attributes.position) return 'empty';
    const pos = geometry.attributes.position.array;
    return `${pos.length}-${pos[0]}-${pos[pos.length-1]}`;
  }

  static optimizeMaterial(material) {
    if (!material) return material;
    
    const key = material.uuid;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key);
    }

    let optimized;
    
    // Use simpler materials for better performance
    if (material.type === 'MeshStandardMaterial' || material.type === 'MeshPhysicalMaterial') {
      optimized = new THREE.MeshLambertMaterial({
        color: material.color,
        map: material.map,
        transparent: material.transparent,
        opacity: material.opacity
      });
    } else {
      optimized = material.clone();
    }

    this.materialCache.set(key, optimized);
    return optimized;
  }

  static clearCache() {
    this.cache.forEach(geometry => geometry.dispose());
    this.materialCache.forEach(material => material.dispose());
    this.cache.clear();
    this.materialCache.clear();
  }
}