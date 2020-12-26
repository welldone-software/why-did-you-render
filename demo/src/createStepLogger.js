const shouldTriggerComment = 'Should trigger whyDidYouRender';
const shouldNotTriggerComment = 'Shouldn\'t trigger whyDidYouRender';

export default function createStepLogger() {
  let step = 0;
  return function stepLogger(description = '', shouldTrigger) {
    const comment = shouldTrigger ? shouldTriggerComment : shouldNotTriggerComment;
    // eslint-disable-next-line no-console
    console.log(
      `\nRender #${step++} %c${description} %c${comment}`,
      'color:blue',
      shouldTrigger ? 'color:red' : 'color:green'
    );
  };
}
