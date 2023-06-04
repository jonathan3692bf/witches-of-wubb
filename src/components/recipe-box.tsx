//import { useContext } from 'react';
//import { AbletonContext } from '../contexts/ableton-provider';
// import { LoggerContext } from '../contexts/logger-provider';

export default function RecipeBox() {
  //const { queuedClips, playingClips, stoppingClips } = useContext(AbletonContext);

  // const { logger } = useContext(LoggerContext);
  const recipes = [
    //TODO - Replace with PlayingClips
    {
      ingrediants: 'Test1',
      imageFile: 'public/icons/magic_icon_bass_342c1a64-2dd6-40ac-b51d-003cabe29068.png',
      colorBlur: 'bg-red-700',
    },
    {
      ingrediants: 'Test2',
      imageFile: 'public/icons/magic_icon_bass_342c1a64-2dd6-40ac-b51d-003cabe29068.png',
      colorBlur: 'bg-green-700',
    },
    {
      ingrediants: 'Test3',
      imageFile: 'public/icons/magic_icon_bass_342c1a64-2dd6-40ac-b51d-003cabe29068.png',
      colorBlur: 'bg-blue-700',
    },
    {
      ingrediants: 'Test4',
      imageFile: 'public/icons/magic_icon_bass_342c1a64-2dd6-40ac-b51d-003cabe29068.png',
      colorBlur: 'bg-yellow-700',
    },
  ];

  return (
    <div id='inner_recipe_box' className='w-full flex flex-col'>
      <div
        id='recipe_bg'
        className="gap-8 mx-auto mt-10 bg-[url('src/assets/images/script_bg.jpg')]"
      >
        <div id='title' className='mt-3 flex items-center justify-center'>
          TEST
        </div>
        <div id='ingredients_contianer' className='gap-8 mx-auto mt-2 grid grid-cols-4 text-center'>
          {recipes.map((recipe) => {
            //TODO - Replace with PlayingClips
            return (
              <div
                id={`ingredient-${recipe.ingrediants}`}
                className='scale-75'
                key={recipe.ingrediants}
              >
                <div
                  id='color-blur'
                  className={`absolute -inset-0 rounded-lg blur-xl z-0 ${recipe.colorBlur}`}
                ></div>
                <img
                  className='relative flex'
                  src={recipe.imageFile}
                  alt={`ingredient-${recipe.ingrediants}`}
                ></img>
                <div id={`ingredient-${recipe.ingrediants}-label`} className='z-30 mt-4 relative'>
                  <div className='mt-3'>{`ingredient-${recipe.ingrediants}`}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
