import * as THREE from 'three';

export class GeometryOptimizer {
  static cache = new Map();
  static materialCache = new Map();
  static MAX_CACHE_SIZE = 50;

  static optimizeGeometry(geometry) {
    if (!geometry) return geometry;
    
    // Disable geometry optimization to prevent corruption
    // Just return the original geometry
    return geometry;
  }

  static compressFloatArray(array, precision = 0.0001) {
    // Don't compress - precision compression can corrupt geometry
    return array;
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

    // Don't dispose cached materials - they might still be in use
    // if (this.materialCache.size >= this.MAX_CACHE_SIZE) {
    //   const firstKey = this.materialCache.keys().next().value;
    //   const oldMaterial = this.materialCache.get(firstKey);
    //   oldMaterial.dispose();
    //   this.materialCache.delete(firstKey);
    // }

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