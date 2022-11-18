import { Configuration, OpenAIApi } from 'https://cdn.skypack.dev/openai';

document.querySelector('#send').addEventListener('click',()=>{
  let inputValue = document.querySelector('#input').value
  let template = `<div class="line">
  <span class="chat-box mine">${inputValue}</span>
</div>`
  if(inputValue == '') return; 
  document.querySelector('.chat-content').insertAdjacentHTML('beforeend',template)
  document.querySelector('#input').value = '';

  //openai connect
  const configuration = new Configuration({
  apiKey: config.apiKey,
  });

  const openai = new OpenAIApi(configuration);

  openai.createCompletion({
    model: "text-davinci-002",
    prompt: inputValue,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }).then((result)=>{
    console.log(result.data.choices[0].text)
    template = `<div class="line">
    <span class="chat-box">${result.data.choices[0].text}</span>
    </div>`
    document.querySelector('.chat-content').insertAdjacentHTML('beforeend',template)
  });
})