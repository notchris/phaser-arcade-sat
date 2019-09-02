import Phaser from 'phaser';
import Polygon from 'polygon';
import SAT from 'sat';

const P = SAT.Polygon;
const V = SAT.Vector;

P.prototype.collidesWith = function(polygon, response){
    return SAT.testPolygonPolygon(this, polygon, response);
};


class SATPoly extends Phaser.GameObjects.Sprite{

    constructor (scene, x, y, points, isStatic, id)
    {
        super(scene, x, y, points, isStatic, id, 'sat');
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.points = points;
        this.isStatic = isStatic;
        this.id = id;

        // Calculate polygon bounding box
        let bounds = new Polygon(points).aabb();

        // Create graphic
        let poly = scene.make.graphics();
        poly.lineStyle(2, 0x00ff00, 1);
        poly.beginPath();
        poly.moveTo(points[0][0], points[0][1]);
        points.forEach((pt) => {
            poly.lineTo(pt[0],pt[1])
        });
        poly.closePath();
        poly.strokePath();
        poly.generateTexture(id, bounds.w, bounds.h);
        poly.destroy();
        this.setTexture(id);

        console.log(this.scene.physics.world.gravity.y)

        // Enable normal Arcade Physics
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setBounce(0);
        this.setPosition(x, y);
        this.setOrigin(0);
        this.body.setCollideWorldBounds(true);

        // Create SAT Poly
        this.sat = new P(new V(x,y), points.map((p) => new V(p[0], p[1])));
        this.sat.pos.x = this.body.position.x; // SAT allows us to set polygon
        this.sat.pos.y = this.body.position.y; // position properties directly
    }

    collides () {

        //console.log(this.x,this.y)
        this.sat.pos.x = this.body.position.x; // SAT allows us to set polygon
        this.sat.pos.y = this.body.position.y; // position properties directly

        if (this.isStatic) return;
        let response = new SAT.Response()
        let children = this.scene.children.list.filter((c) => c.sat !== null && c !== this);
        children.forEach((child) => {
            let collided = this.sat.collidesWith(child.sat, response);
            if (collided) {
                let overlapV = response.overlapV.clone().scale(-1)
                console.log(overlapV.x,overlapV.y)
                console.log('Before Position:',this.body.position.x,this.body.position.y)
                this.body.position.x += overlapV.x;
                this.body.position.y += overlapV.y;
                console.log('After Position:',this.body.position.x,this.body.position.y)



                const velocity = new SAT.V(this.body.velocity.x, this.body.velocity.y)

                const overlapN = response.overlapN.clone().scale(-1)
        
                const velocityN = velocity.clone().projectN(overlapN)
        
                const velocityT = velocity.clone().sub(velocityN)
        
                const bounce = velocityN.clone().scale(0)
        
                const friction = velocityT.clone().scale(1)
        
                const newVelocity = friction.clone().add(bounce)

                this.body.velocity.x = newVelocity.x;
                this.body.velocity.y = newVelocity.y;
            }
        });
    }

    preUpdate (time, delta) {
        super.preUpdate(time, delta);
        this.collides();


    }   
}

export default class SATPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager);
        pluginManager.registerGameObject('sat', this.createObj);
    }

    createObj (x, y, points, isStatic, id) {
        let p = new SATPoly(this.scene, x, y, points, isStatic, id);
        this.displayList.add(p);
        
        return p;
    }

}