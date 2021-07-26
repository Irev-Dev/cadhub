const setPoints = (points, p, i)=>{
	points[i++] = p[0]
	points[i++] = p[1]
	points[i++] = p[2] || 0					
}

function CSG2Vertices(csg){
    let idx = 0

    let vLen = 0, iLen = 0
    for (let poly of csg.polygons){
    	let len = poly.vertices.length
    	vLen += len *3
    	iLen += 3 * (len-2)
    }
    const vertices = new Float32Array(vLen)
    const indices  = vLen > 65535 ? new Uint32Array(iLen) : new Uint16Array(iLen)

    let vertOffset = 0
    let indOffset = 0
    let posOffset = 0
    let first = 0
    for (let poly of csg.polygons){
    	let arr = poly.vertices
    	let len = arr.length
    	first = posOffset
    	vertices.set(arr[0], vertOffset)
    	vertOffset +=3
    	vertices.set(arr[1], vertOffset)
    	vertOffset +=3
    	posOffset  +=2
    	for(let i=2; i<len; i++){
	    	vertices.set(arr[i], vertOffset)
	        
	        indices[indOffset++] = first
	        indices[indOffset++] = first + i -1
	        indices[indOffset++] = first + i 
	        
        	vertOffset += 3
        	posOffset  += 1
    	}
    }
    return {vertices, indices, type:'mesh'}
}


function CSG2LineVertices(csg){
	let vLen = csg.points.length * 3
	if(csg.isClosed) vLen += 3

	var vertices = new Float32Array(vLen)
	
	
	csg.points.forEach((p,idx)=>setPoints(vertices, p, idx * 3 ))
	
	if(csg.isClosed){
		setPoints(vertices, csg.points[0], vertices.length - 3 )
	}
	return {vertices, type:'line'}
}			

function CSG2LineSegmentsVertices(csg){
	let vLen = csg.sides.length * 6

	var vertices = new Float32Array(vLen)
	csg.sides.forEach((side,idx)=>{
		let i = idx * 6 
		setPoints(vertices, side[0], i)
		setPoints(vertices, side[1], i+3)
	})
	return {vertices, type:'lines'}

}

function CSGCached(func, data, cacheKey, transferable){
	cacheKey = cacheKey || data

	let geo = CSGToBuffers.cache.get(cacheKey)
	if(geo) return geo

	geo = func(data)

	// fill transferable array for postMessage optimization
	if(transferable){				
		const {vertices, indices} = geo
		transferable.push(vertices)
		if(indices) transferable.push(indices)
	}

    CSGToBuffers.cache.set(cacheKey, geo)
    return geo			
}

function CSGToBuffers(csg, transferable){
	let obj

	if(csg.polygons) obj = CSGCached(CSG2Vertices,csg,csg.polygons, transferable)
	if(csg.sides && !csg.points) obj = CSGCached(CSG2LineSegmentsVertices,csg,csg.sides, transferable)
	if(csg.points) obj = CSGCached(CSG2LineVertices,csg,csg.points, transferable)

	return obj
}
CSGToBuffers.clearCache = ()=>{CSGToBuffers.cache = new WeakMap()}
CSGToBuffers.clearCache()

export  {CSGToBuffers}