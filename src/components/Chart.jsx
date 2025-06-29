"use client"

import { useEffect, useRef } from 'react'

const Chart = ({ 
  type = 'bar', 
  data, 
  options = {}, 
  height = 300,
  className = ''
}) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || !data) return

    // Clear previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create canvas element
    const canvas = document.createElement('canvas')
    canvas.height = height
    canvas.style.width = '100%'
    canvas.style.height = `${height}px`
    
    // Clear container
    chartRef.current.innerHTML = ''
    chartRef.current.appendChild(canvas)

    const ctx = canvas.getContext('2d')

    // Default chart options
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false
        }
      }
    }

    // Merge options
    const chartOptions = { ...defaultOptions, ...options }

    // Create chart data
    let chartData = {
      labels: data.labels || [],
      datasets: []
    }

    if (type === 'bar') {
      chartData.datasets = [{
        label: data.label || 'Data',
        data: data.values || [],
        backgroundColor: data.backgroundColor || [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderColor: data.borderColor || [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)'
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    } else if (type === 'line') {
      chartData.datasets = [{
        label: data.label || 'Data',
        data: data.values || [],
        borderColor: data.borderColor || 'rgba(59, 130, 246, 1)',
        backgroundColor: data.backgroundColor || 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: data.fill !== false,
        tension: 0.4,
        pointBackgroundColor: data.pointBackgroundColor || 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    } else if (type === 'doughnut') {
      chartData.datasets = [{
        label: data.label || 'Data',
        data: data.values || [],
        backgroundColor: data.backgroundColor || [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: data.borderColor || '#FFFFFF',
        borderWidth: 2,
        cutout: '60%'
      }]
    } else if (type === 'pie') {
      chartData.datasets = [{
        label: data.label || 'Data',
        data: data.values || [],
        backgroundColor: data.backgroundColor || [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: data.borderColor || '#FFFFFF',
        borderWidth: 2
      }]
    }

    // Create chart using Chart.js
    if (window.Chart) {
      chartInstance.current = new window.Chart(ctx, {
        type: type,
        data: chartData,
        options: chartOptions
      })
    } else {
      // Fallback: Create a simple SVG chart
      createSVGChart(data, type, height)
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type, height, options])

  const createSVGChart = (data, chartType, chartHeight) => {
    if (!chartRef.current) return

    const values = data.values || []
    const labels = data.labels || []
    const maxValue = Math.max(...values, 1)
    const width = chartRef.current.clientWidth
    const height = chartHeight
    const padding = 40

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.style.width = '100%'
    svg.style.height = `${height}px`

    if (chartType === 'bar') {
      const barWidth = (width - 2 * padding) / values.length
      const barSpacing = barWidth * 0.2

      values.forEach((value, index) => {
        const barHeight = ((value / maxValue) * (height - 2 * padding))
        const x = padding + index * barWidth + barSpacing / 2
        const y = height - padding - barHeight

        // Bar
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('x', x)
        rect.setAttribute('y', y)
        rect.setAttribute('width', barWidth - barSpacing)
        rect.setAttribute('height', barHeight)
        rect.setAttribute('fill', '#3B82F6')
        rect.setAttribute('rx', '4')
        svg.appendChild(rect)

        // Label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x', x + (barWidth - barSpacing) / 2)
        text.setAttribute('y', height - padding + 15)
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('fill', '#6B7280')
        text.setAttribute('font-size', '12')
        text.textContent = labels[index] || value
        svg.appendChild(text)
      })
    }

    chartRef.current.innerHTML = ''
    chartRef.current.appendChild(svg)
  }

  return (
    <div 
      ref={chartRef} 
      className={`chart-container ${className}`}
      style={{ height: `${height}px` }}
    >
      {!data && (
        <div className="flex items-center justify-center h-full text-gray-500">
          <i className="fas fa-chart-bar mr-2"></i>
          No data available
        </div>
      )}
    </div>
  )
}

export default Chart 