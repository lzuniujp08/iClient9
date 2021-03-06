import mapboxgl from 'mapbox-gl';
import '../core/Base';

/**
 * @class mapboxgl.supermap.ServiceBase
 * @private
 * @description mapboxgl.supermap服务基类
 * @param url - {string} 与客户端交互的服务地址。
 * @param options - {Object} 可选参数。如：<br>
 *        serverType - {{@link SuperMap.ServerType}} 服务来源 iServer|iPortal|online
 */
export default class ServiceBase extends mapboxgl.Evented {

    constructor(url, options) {
        super();
        this.options = options || {};
        this.url = url;
        this.fire('initialized', this);
    }
}
mapboxgl.supermap.ServiceBase = ServiceBase;