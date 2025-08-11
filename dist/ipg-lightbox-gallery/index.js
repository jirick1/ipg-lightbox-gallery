(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { MediaUpload, MediaUploadCheck, InspectorControls, RichText, useBlockProps } = wp.blockEditor || wp.editor;
  const { Button, PanelBody, TextControl, TextareaControl, Placeholder } = wp.components;
  const { useDispatch } = wp.data;
  const el = wp.element.createElement;

  registerBlockType('ipg/gallery', {
    title: 'IPG Lightbox Gallery',
    icon: 'format-gallery',
    category: 'media',
    attributes: { items: { type: 'array', default: [] } },
    edit: (props) => {
      const { attributes: { items }, setAttributes, clientId } = props;
      const { removeBlocks } = useDispatch('core/block-editor');
      const blockProps = (useBlockProps ? useBlockProps({ className: 'ipg', 'data-ipg': true }) : { className: 'ipg', 'data-ipg': true });

      const onSelectImages = (media) => {
        const add = (Array.isArray(media) ? media : [media]).map(m => ({
          id: m.id, src: m.url, width: m.width, height: m.height,
          alt: m.alt || m.title || '', caption: m.caption || '', seo: ''
        }));
        setAttributes({ items: [...items, ...add] });
      };

      const updateItem = (idx, patch) => {
        const next = items.slice();
        next[idx] = Object.assign({}, next[idx], patch);
        setAttributes({ items: next });
      };

      const removeItem = (idx) => {
        const next = items.slice(); next.splice(idx,1); setAttributes({ items: next });
      };

      if (!items.length) {
        return el('div', blockProps,
          el(Placeholder, { label: 'IPG Lightbox Gallery', instructions: 'Add some images to begin.' },
            el(MediaUploadCheck, null,
              el(MediaUpload, {
                onSelect: onSelectImages,
                allowedTypes: ['image'],
                multiple: true,
                gallery: true,
                render: ({ open }) => el(Button, { variant: 'primary', onClick: open }, 'Add Images')
              })
            ),
            el(Button, { isDestructive: true, onClick: () => removeBlocks([clientId]), style: { marginLeft: '8px' } }, 'Remove Block')
          )
        );
      }

      return el('div', blockProps,
        el(InspectorControls, null,
          el(PanelBody, { title: 'Bulk JSON (optional)' },
            el(TextareaControl, {
              label: 'Paste JSON array of items [{src,alt,caption,seo,width,height}]',
              help: 'Paste to replace items. Make sure it’s valid JSON.',
              value: '',
              onChange: (val) => {
                try { const arr = JSON.parse(val); if (Array.isArray(arr)) setAttributes({ items: arr }); } catch (e) {}
              }
            })
          )
        ),
        el('div', { className: 'page-container' },
          el('div', { className: 'img-gallery' },
            items.map((it, i) =>
              el('div', { key: i, className: 'img-gallery__item' },
                el('figure', null,
                  el('img', { src: it.src, alt: it.alt || '', width: it.width, height: it.height }),
                  el(RichText, {
                    tagName: 'figcaption',
                    placeholder: 'Caption…',
                    value: it.caption || '',
                    onChange: (v) => updateItem(i, { caption: v })
                  }),
                  el('div', { style: { marginTop: '.5rem' } },
                    el(TextControl, { label: 'Alt', value: it.alt || '', onChange: (v) => updateItem(i, { alt: v }) }),
                    el(TextareaControl, { label: 'SEO text (optional)', value: it.seo || '', onChange: (v) => updateItem(i, { seo: v }) }),
                    el('div', { style: { display: 'flex', gap: '.5rem' } },
                      el(Button, { isSecondary: true, onClick: () => updateItem(i, { }) }, 'Update'),
                      el(Button, { isDestructive: true, onClick: () => removeItem(i) }, 'Remove')
                    )
                  )
                )
              )
            )
          ),
          el(MediaUploadCheck, null,
            el(MediaUpload, {
              onSelect: onSelectImages,
              allowedTypes: ['image'],
              multiple: true,
              gallery: true,
              render: ({ open }) => el(Button, { variant: 'primary', onClick: open, style: { marginTop: '1rem' } }, 'Add Images')
            })
          )
        )
      );
    },
    save: () => null
  });
})(window.wp);
