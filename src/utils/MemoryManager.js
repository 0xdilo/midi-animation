import { GeometryOptimizer } from './GeometryOptimizer';

export class MemoryManager {
  static materials = new Set();
  static geometries = new Set();
  static textures = new Set();
  static intervalId = null;

  static startCleanupCycle() {
    if (this.intervalId) return;
    
    // Run cleanup every 2 minutes (less aggressive)
    this.intervalId = setInterval(() => {
      this.forceGarbageCollection();
    }, 120000);
  }

  static stopCleanupCycle() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  static registerMaterial(material) {
    this.materials.add(material);
  }

  static registerGeometry(geometry) {
    this.geometries.add(geometry);
  }

  static registerTexture(texture) {
    this.textures.add(texture);
  }

  static forceGarbageCollection() {
    console.log('🧹 Running memory cleanup...');
    
    // Clear unused resources
    this.materials.forEach(material => {
      if (material.dispose && material._unused) {
        material.dispose();
        this.materials.delete(material);
      }
    });

    this.geometries.forEach(geometry => {
      if (geometry.dispose && geometry._unused) {
        geometry.dispose();
        this.geometries.delete(geometry);
      }
    });

    this.textures.forEach(texture => {
      if (texture.dispose && texture._unused) {
        texture.dispose();
        this.textures.delete(texture);
      }
    });

    // Don't clear optimizer caches - resources still in use
    // GeometryOptimizer.clearCache();

    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }

    console.log(`🧹 Cleanup complete. Active: ${this.materials.size} materials, ${this.geometries.size} geometries, ${this.textures.size} textures`);
  }

  static getMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }

  static logMemoryUsage() {
    const usage = this.getMemoryUsage();
    if (usage) {
      console.log(`💾 Memory: ${usage.used}MB used / ${usage.total}MB total (limit: ${usage.limit}MB)`);
    }
  }
}