'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { FamilyMember, sampleFamilyData } from '../db/familytreedata'
import Image from 'next/image'

// Place calculateDimensions at the top of the file
const calculateDimensions = (
    node: FamilyMember
): { width: number; height: number } => {
    if (!node.children || node.children.length === 0) {
        return { width: 130, height: 150 } // Default size for a single node
    }

    let totalWidth = 0
    let maxHeight = 0

    const childDimensions = node.children.map((child) =>
        calculateDimensions(child)
    )

    childDimensions.forEach((dim) => {
        totalWidth += dim.width + 30 // Add spacing between subtrees
        maxHeight = Math.max(maxHeight, dim.height)
    })

    return {
        width: Math.max(130, totalWidth - 50), // Ensure it doesn’t shrink too much
        height: 150 + maxHeight,
    }
}
export const FamilyTreeComp: React.FC = () => {
    const [dimensions, setDimensions] = useState({ width: 800, height: 800 })

    useEffect(() => {
        const calculateDimensions = (
            node: FamilyMember
        ): { width: number; height: number } => {
            if (!node.children || node.children.length === 0) {
                return { width: 130, height: 150 }
            }

            let totalWidth = 0
            let maxHeight = 0

            const childDimensions = node.children.map((child) =>
                calculateDimensions(child)
            )

            childDimensions.forEach((dim) => {
                totalWidth += dim.width + 70 // Adding spacing between subtrees
                maxHeight = Math.max(maxHeight, dim.height)
            })

            return {
                width: Math.max(130, totalWidth - 50), // Subtract last added space
                height: 150 + maxHeight,
            }
        }

        const treeDimensions = calculateDimensions(sampleFamilyData)
        setDimensions({
            width: treeDimensions.width,
            height: treeDimensions.height,
        })
    }, [])

    return (
        <div className="w-full overflow-x-auto">
            <div className="relative mb-[2rem] min-w-[1200px]">
                <svg width={dimensions.width} height={dimensions.height}>
                    <TreeNode
                        node={sampleFamilyData}
                        x={dimensions.width / 2}
                        y={50}
                    />
                </svg>
            </div>
        </div>
    )
}

interface TreeNodeProps {
    node: FamilyMember
    x: number
    y: number
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, x, y }) => {
    const renderChildren = () => {
        if (!node.children || node.children.length === 0) return null

        const childDimensions = node.children.map((child) =>
            calculateDimensions(child)
        )

        const totalChildWidth = childDimensions.reduce(
            (sum, dim) => sum + dim.width + 50,
            -50
        ) // Remove extra spacing
        let currentX = x - totalChildWidth / 2 // Start position for first child

        return (
            <>
                {/* Shorter vertical line down from parent (Only if node has children) */}
                {node.children.length > 0 && (
                    <line
                        key={node._id}
                        x1={x}
                        y1={y + 50} // Increased from y + 50
                        x2={x}
                        y2={y + 95} // Increased from y + 80
                        stroke="#8D6A4A"
                        strokeWidth={1.5}
                    />
                )}

                {/* Render child nodes with horizontal and vertical lines */}
                {node.children.map((child, index) => {
                    const childX = currentX + childDimensions[index].width / 2
                    const childY = y + 170 // Reduced vertical spacing

                    currentX += childDimensions[index].width + 50

                    return (
                        <g key={child._id}>
                            {/* Horizontal line connecting siblings */}
                            <line
                                x1={x}
                                y1={y + 95} // Matches vertical line bottom
                                x2={childX}
                                y2={y + 95} // Aligns horizontally
                                stroke="#8D6A4A"
                                strokeWidth={1.5}
                            />
                            {/* Vertical line down to child */}
                            <line
                                x1={childX}
                                y1={y + 95} // Start from adjusted height
                                x2={childX}
                                y2={childY - 30} // Increased gap before circle
                                stroke="#8D6A4A"
                                strokeWidth={1.5}
                            />

                            {/* Recursive call for child node */}
                            <TreeNode node={child} x={childX} y={childY} />
                        </g>
                    )
                })}
            </>
        )
    }

    return (
        <g>
            <foreignObject x={x - 20} y={y - 20} width={40} height={40}>
                <div
                    style={{ borderColor: node.color || '#8D6A4A' }}
                    className="w-[40px] h-[40px] overflow-hidden rounded-full  border-[2px]"
                >
                    <Image
                        alt="image"
                        height={40}
                        width={40}
                        className="w-full h-full object-cover"
                        src={
                            node.image?.trim()
                                ? node.image
                                : '/images/family-tree/user.svg'
                        }
                    />
                </div>
            </foreignObject>

            {/* Name under the Circle */}
            <foreignObject
                x={x - 50} // Adjust position
                y={y + 20} // Adjust position
                width="100" // Set width constraint for wrapping
                height="50" // Set height
            >
                <div
                    style={{
                        fontSize: '10px',
                        color: '#8D6A4A',
                        textAlign: 'center',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        backgroundColor: '#FBE9DC',
                    }}
                >
                    {node.name}
                </div>
            </foreignObject>

            {renderChildren()}
        </g>
    )
}

export default TreeNode

// import React, { useEffect, useRef } from 'react'
// import * as d3 from 'd3'
// import { sampleFamilyData } from '../db/familytreedata'
// import { FamilyMember } from '../db/familytreedata'

// // D3 Tree Component
// const FamilyTreeD3: React.FC = () => {
//     const svgRef = useRef<SVGSVGElement | null>(null)

//     useEffect(() => {
//         if (!svgRef.current) return

//         // Clear previous SVG contents
//         d3.select(svgRef.current).selectAll('*').remove()

//         // Set up full-screen dimensions
//         const width = window.innerWidth
//         const height = window.innerHeight
//         const margin = { top: 20, right: 90, bottom: 30, left: 90 }

//         // Create an SVG container
//         const svg = d3
//             .select(svgRef.current)
//             .attr('width', width)
//             .attr('height', height)
//             .append('g')
//             .attr('transform', `translate(${margin.left}, ${margin.top})`)

//         // Create the tree layout
//         const tree = d3.tree().size([width - 200, height - 200])

//         // Convert data to D3 hierarchy
//         const root = d3.hierarchy(sampleFamilyData)

//         // Generate tree structure
//         tree(root)

//         // Create links between nodes
//         svg.selectAll('path.link')
//             .data(root.links())
//             .enter()
//             .append('path')
//             .attr('class', 'link')
//             .attr(
//                 'd',
//                 (d) => `
//               M${d.source.x},${d.source.y}
//               C${d.source.x},${(d.source.y + d.target.y) / 2}
//               ${d.target.x},${(d.source.y + d.target.y) / 2}
//               ${d.target.x},${d.target.y}
//           `
//             )
//             .attr('fill', 'none')
//             .attr('stroke', '#ccc')
//             .attr('stroke-width', '2px')

//         // Create nodes
//         const node = svg
//             .selectAll('g.node')
//             .data(root.descendants())
//             .enter()
//             .append('g')
//             .attr('class', 'node')
//             .attr('transform', (d) => `translate(${d.x},${d.y})`)

//         // Append circles for each node
//         node.append('circle')
//             .attr('r', 30)
//             .attr('fill', 'lightgray')
//             .attr('stroke', '#000')
//             .attr('stroke-width', '2px')

//         // ClipPath to ensure image stays within circle
//         node.append('clipPath')
//             .attr('id', (d, i) => `clip-${i}`)
//             .append('circle')
//             .attr('r', 30)

//         // Append images inside circles
//         node.append('image')
//             .attr('xlink:href', (d) => d.data.image || 'default-avatar.png')
//             .attr('x', -30)
//             .attr('y', -30)
//             .attr('width', 60)
//             .attr('height', 60)
//             .attr('clip-path', (d, i) => `url(#clip-${i})`)

//         // Append text below each node
//         node.append('text')
//             .attr('y', 40)
//             .attr('text-anchor', 'middle')
//             .attr('font-size', '12px')
//             .attr('fill', '#000')
//             .text((d) => d.data.name)
//     }, [])

//     return (
//         <div style={{ overflow: 'auto', width: '100vw', height: '100vh' }}>
//             <svg ref={svgRef}></svg>
//         </div>
//     )
// }

// export default FamilyTreeD3
