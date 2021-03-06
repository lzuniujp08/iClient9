require('../../../src/common/commontypes/Bounds');

describe('Bounds', function () {
    it('constructor, clone, equals, toString, toArray', function () {
        var bounds = new SuperMap.Bounds([-180, -90, 180, 90]);
        var bounds1 = bounds.clone();
        expect(bounds).not.toBeNull();
        expect(bounds.CLASS_NAME).toEqual("SuperMap.Bounds");
        expect(bounds.bottom).toEqual(-90);
        expect(bounds.left).toEqual(-180);
        expect(bounds.right).toEqual(180);
        expect(bounds.top).toEqual(90);
        expect(bounds).toEqual(bounds1);
        var isEqual = bounds1.equals(bounds);
        expect(isEqual).toBeTruthy();
        var str = bounds.toString();
        expect(str).toEqual("-180,-90,180,90");
        var array = bounds.toArray(true);
        expect(array.length).toEqual(4);
        expect(array[0]).toEqual(-90);
        expect(array[1]).toEqual(-180);
        expect(array[2]).toEqual(90);
        expect(array[3]).toEqual(180);
        var array1 = bounds.toArray(false);
        expect(array1.length).toEqual(4);
        expect(array1[0]).toEqual(-180);
        expect(array1[1]).toEqual(-90);
        expect(array1[2]).toEqual(180);
        expect(array1[3]).toEqual(90);
        bounds.destroy();
    });

    //取小数点后decimal位数字进行四舍五入再转换为BBOX字符串
    it('toBBOX', function () {
        var bounds = new SuperMap.Bounds(-1.1234567, -1.7654321, 1.4444444, 1.5555555);
        var str1 = bounds.toBBOX();
        expect(str1).toEqual("-1.123457,-1.765432,1.444444,1.555556");
        var str2 = bounds.toBBOX(1);
        expect(str2).toEqual("-1.1,-1.8,1.4,1.6");
        var str3 = bounds.toBBOX(1, true);
        expect(str3).toEqual("-1.8,-1.1,1.6,1.4");
        bounds.destroy();
    });

    //基于当前边界范围创建一个新的多边形对象
    it('toGeometry', function () {
        var bounds = new SuperMap.Bounds(-180, -90, 100, 80);
        var geo = bounds.toGeometry();
        expect(geo).not.toBeNull();
        expect(geo.CLASS_NAME).toEqual("SuperMap.Geometry.Polygon");
        expect(geo.id).toContain("SuperMap.Geometry");
        expect(geo.componentTypes[0]).toEqual("SuperMap.Geometry.LinearRing");
        bounds.destroy();
    });

    it('getSize, getCenterPixel', function () {
        var bounds = new SuperMap.Bounds(-180, -90, 100, 80);
        var size = bounds.getSize();
        var pixel = bounds.getCenterPixel();
        expect(size.w).toEqual(280);
        expect(size.h).toEqual(170);
        expect(pixel.x).toEqual(-40);
        expect(pixel.y).toEqual(-5);
        bounds.destroy();
    });

    it('scale', function () {
        var bounds = new SuperMap.Bounds(-50, -50, 40, 40);
        var bounds1 = bounds.scale(2);
        expect(bounds1).not.toBeNull();
        expect(bounds1.bottom).toEqual(-95);
        expect(bounds1.left).toEqual(-95);
        expect(bounds1.right).toEqual(85);
        expect(bounds1.top).toEqual(85);
        var origin = new SuperMap.Pixel(40, 50);
        var bounds2 = bounds.scale(2, origin);
        expect(bounds2).not.toBeNull();
        expect(bounds2.bottom).toEqual(-150);
        expect(bounds2.left).toEqual(-140);
        expect(bounds2.right).toEqual(40);
        expect(bounds2.top).toEqual(30);
        bounds.destroy();
    });

    it('add', function () {
        var bounds = new SuperMap.Bounds(-50, -50, 40, 40);
        var newBounds = bounds.add(20, 10);
        expect(newBounds).not.toBeNull();
        expect(newBounds.bottom).toEqual(-40);
        expect(newBounds.left).toEqual(-30);
        expect(newBounds.right).toEqual(60);
        expect(newBounds.top).toEqual(50);
        bounds.destroy();
    });

    //在当前bounds上扩展bounds
    it('extend', function () {
        var bounds = new SuperMap.Bounds(-50, -50, 40, 40);
        spyOn(bounds, 'extend').and.callThrough();
        bounds.extend(new SuperMap.LonLat(50, 60));
        expect(bounds).not.toBeNull();
        bounds.extend(new SuperMap.Geometry.Point(50, 60));
        expect(bounds).not.toBeNull();
        bounds.extend(new SuperMap.Bounds(50, 60));
        expect(bounds).not.toBeNull();
        expect(bounds.bottom).toEqual(-50);
        expect(bounds.left).toEqual(-50);
        expect(bounds.right).toEqual(50);
        expect(bounds.top).toEqual(60);
        bounds.destroy();
    });

    //判断传入的坐标是否在范围内
    it('containsLonLat', function () {
        var bounds = new SuperMap.Bounds(-50, -50, 40, 40);
        var isContains1 = bounds.containsLonLat(new SuperMap.LonLat(40, 40), true);
        expect(isContains1).toBeTruthy();
        var isContains2 = bounds.containsLonLat(
            new SuperMap.LonLat(400, 40),
            {
                inclusive: true,
                worldBounds: new SuperMap.Bounds(-180, -90, 180, 90)
            }
        );
        expect(isContains2).toBeTruthy();
        bounds.destroy();
    });

    it('containsPixel', function () {
        var bounds = new SuperMap.Bounds(-50, -50, 40, 40);
        var isContains = bounds.containsPixel(new SuperMap.Pixel(40, 40), true);
        expect(isContains).toBeTruthy();
        bounds.destroy();
    });

    it('contains', function () {
        var bounds = new SuperMap.Bounds(-50, -50, 40, 40);
        var isContains1 = bounds.contains(40, 40);
        var isContains2 = bounds.contains();
        var isContains3 = bounds.contains(40, 40, false);
        expect(isContains1).toBeTruthy();
        expect(isContains2).toBeFalsy();
        expect(isContains3).toBeFalsy();
        bounds.destroy();
    });

    //判断目标边界范围是否与当前边界范围相交
    it('intersectsBounds', function () {
        var bounds = new SuperMap.Bounds(-180, -90, 100, 80);
        var options1 = {
            inclusive: false,
            worldBounds: new SuperMap.Bounds(-170, -90, 120, 80)
        };
        var options2 = {
            inclusive: false,
            worldBounds: new SuperMap.Bounds(-180, -90, 100, 80)
        };
        var isIntersects1 = bounds.intersectsBounds(
            new SuperMap.Bounds(100, -90, 120, 80),
            options1
        );
        var isIntersects2 = bounds.intersectsBounds(
            new SuperMap.Bounds(100, -90, 100, 80),
            options2
        );
        expect(isIntersects1).toBeTruthy();
        expect(isIntersects2).toBeFalsy();
        bounds.destroy();
    });

    it('determineQuadrant', function () {
        var bounds = new SuperMap.Bounds(-180, -90, 100, 80);
        var str = bounds.determineQuadrant(new SuperMap.LonLat(20, 20));
        expect(str).toEqual("tr");
        bounds.destroy();
    });

    it('toServerJSONObject', function () {
        var bounds = new SuperMap.Bounds(-180, -90, 100, 80);
        var obj = bounds.toServerJSONObject();
        expect(obj).not.toBeNull();
        expect(obj.bottom).toEqual(-90);
        expect(obj.left).toEqual(-180);
        expect(obj.right).toEqual(100);
        expect(obj.top).toEqual(80);
        expect(obj.leftBottom).not.toBeNull();
        expect(obj.rightTop).not.toBeNull();
        bounds.destroy();
    });

    it('fromString', function () {
        var bounds = SuperMap.Bounds.fromString("-180,-90,100,80", false);
        expect(bounds).not.toBeNull();
        expect(bounds.bottom).toEqual(-90);
        expect(bounds.left).toEqual(-180);
        expect(bounds.right).toEqual(100);
        expect(bounds.top).toEqual(80);
    });

    it('fromSize', function () {
        var bounds = SuperMap.Bounds.fromSize(new SuperMap.Size(20, 10));
        expect(bounds).not.toBeNull();
        expect(bounds.bottom).toEqual(10);
        expect(bounds.left).toEqual(0);
        expect(bounds.right).toEqual(20);
        expect(bounds.top).toEqual(0);
    });

    it('oppositeQuadrant', function () {
        var oppositeQuadrant = SuperMap.Bounds.oppositeQuadrant("tl");
        expect(oppositeQuadrant).toEqual("br");
    });
});