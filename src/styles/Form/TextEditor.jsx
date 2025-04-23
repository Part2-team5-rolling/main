import { useState, useEffect, useRef, useMemo } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Autosave, BlockQuote, Bold, Essentials, Indent, IndentBlock, Italic, Link, Paragraph, Underline } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

function Editor({ handleChange, className }) {
  const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

  const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: ['bold', 'italic', 'underline', '|', 'link', 'blockQuote', '|', 'outdent', 'indent'],
					shouldNotGroupWhenFull: false
				},
				plugins: [Autosave, BlockQuote, Bold, Essentials, Indent, IndentBlock, Italic, Link, Paragraph, Underline],
				initialData:
					'',
				licenseKey: 'GPL',
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				placeholder: 'Type or paste your content here!'
			}
		};
	}, [isLayoutReady]);

  return (
    <div className={`editor-container editor-container_classic-editor ${className}`} ref={editorContainerRef}>
      <div className="editor-container__editor">
        <div ref={editorRef}>{editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} onChange={(_, edt) => handleChange(edt.getData())} />}</div>
      </div>
    </div>
  );
}

export default Editor;
