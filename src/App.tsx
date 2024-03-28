import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import './App.scss'
import html2canvas from 'html2canvas'

const logo =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png'

function App() {
  const { control, watch } = useForm()
  const htmlInput = watch('htmlInput')
  const [image, setImage] = useState<string>(logo)
  const [, setHtmlContent] = useState<string>('')

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setImage(URL.createObjectURL(file))
  }
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const easyText = (
    <span style={{ color: 'white' }}>텍스트를 입력해 주세요.</span>
  )

  const downloadImage = async () => {
    const element = document.getElementById('thumbnail')
    if (!element) {
      return false
    }

    const canvas = await html2canvas(element, { useCORS: true })
    const thumbnail = canvas.toDataURL('image/png')
    const link = document.createElement('a')

    link.href = thumbnail
    link.download = 'downloaded-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="Body">
      <div className="Preview-background" id="thumbnail">
        <div className="Thumbnail-div">
          <img src={image} className="Thumbnail-image" alt="thumbnail" />
          <div
            className="Thumbnail-text"
            dangerouslySetInnerHTML={{
              __html:
                htmlInput ||
                '<h3 style="color: white;">텍스트를 입력해 주세요.</h3>'
            }}
          />
        </div>
      </div>
      <div className="Input-background">
        <h2>개발 블로그 썸네일 생성기</h2>
        <div className="Select-image">
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>이미지를 드래그앤드랍 하거나 클릭하여 선택하세요.</p>
          </div>
        </div>
        <div className="Select-text">
          <Controller
            name="htmlInput"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="HTML 내용을 입력하세요."
                value={field.value}
                onChange={e => {
                  setHtmlContent(e.target.value)
                  field.onChange(e)
                }}
              />
            )}
          />
        </div>
        <button
          className="Download-button"
          onClick={() => {
            downloadImage()
          }}
        >
          저장하기
        </button>
      </div>
    </div>
  )
}

export default App
